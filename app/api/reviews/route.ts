import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
    movieKey: z.string(),
    movieSource: z.enum(['tmdb', 'omdb']),
    title: z.string(),
    year: z.string().optional(),
    poster: z.string().optional(),
    genres: z.string().optional(), // JSON string
    runtime: z.string().optional(),
    director: z.string().optional(),
    actors: z.string().optional(), // JSON string
    overview: z.string().optional(),
    ratingStars: z.number().min(1).max(5),
    verdict: z.string(),
    prosText: z.string().optional(),
    consText: z.string().optional(),
    reviewText: z.string().optional(),
    isPublic: z.boolean().optional().default(false),
});

// GET all reviews for logged-in user (private + public)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const reviews = await prisma.review.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error('Fetch reviews error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST create a new review
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            console.error('[POST /api/reviews] Unauthorized: No session or user ID');
            return NextResponse.json(
                {
                    message: 'Unauthorized - Please log in to save reviews to the cloud',
                    statusCode: 401
                },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log('[POST /api/reviews] Request body:', JSON.stringify(body, null, 2));

        const parsed = reviewSchema.safeParse(body);

        if (!parsed.success) {
            console.error('[POST /api/reviews] Validation failed:', parsed.error.issues);
            return NextResponse.json(
                {
                    message: 'Invalid input - Please check your review data',
                    statusCode: 400,
                    errors: parsed.error.issues
                },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Verify user exists in database, create if missing (can happen with JWT sessions)
        let userExists = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true }
        });

        if (!userExists) {
            console.warn('[POST /api/reviews] User not in database, creating from session:', session.user.id);

            // Create user from session data (happens with JWT sessions after DB reset)
            try {
                await prisma.user.create({
                    data: {
                        id: session.user.id,
                        email: session.user.email || `user-${session.user.id}@placeholder.com`,
                        name: session.user.name || 'User',
                    }
                });
                console.log('[POST /api/reviews] User created successfully');
            } catch (createError) {
                console.error('[POST /api/reviews] Failed to create user:', createError);
                return NextResponse.json(
                    {
                        message: 'User account error. Please log out and log in again.',
                        statusCode: 403
                    },
                    { status: 403 }
                );
            }
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                movieKey: data.movieKey,
                movieSource: data.movieSource,
                title: data.title,
                year: data.year,
                poster: data.poster,
                genres: data.genres || '[]',
                runtime: data.runtime,
                director: data.director,
                actors: data.actors || '[]',
                overview: data.overview,
                ratingStars: data.ratingStars,
                verdict: data.verdict,
                prosText: data.prosText,
                consText: data.consText,
                reviewText: data.reviewText,
                isPublic: data.isPublic || false,
            },
        });

        console.log('[POST /api/reviews] Review created successfully:', review.id);
        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('[POST /api/reviews] Database error:', error);

        // Return detailed error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            {
                message: `Failed to create review: ${errorMessage}`,
                statusCode: 500
            },
            { status: 500 }
        );
    }
}
