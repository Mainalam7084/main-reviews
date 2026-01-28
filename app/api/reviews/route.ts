import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';

const ReviewSchema = z.object({
    movieKey: z.string(),
    movieSource: z.enum(['tmdb', 'omdb']),
    title: z.string(),
    year: z.string().optional(),
    poster: z.string().optional(),
    genres: z.array(z.string()),
    runtime: z.string().optional(),
    director: z.string().optional(),
    actors: z.array(z.string()),
    overview: z.string().optional(),
    ratingStars: z.number().min(1).max(5),
    verdict: z.enum(['NEVER_WATCH', 'WATCH', 'RECOMMEND', 'STRONGLY_RECOMMEND', 'BEST_EVER']),
    prosText: z.string().optional(),
    consText: z.string().optional(),
    reviewText: z.string().optional(),
});

// GET all reviews for the authenticated user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const verdict = searchParams.get('verdict');
        const stars = searchParams.get('stars');
        const year = searchParams.get('year');
        const search = searchParams.get('search');

        const where: any = {
            userId: session.user.id,
        };

        if (verdict) {
            where.verdict = verdict;
        }

        if (stars) {
            where.ratingStars = parseInt(stars);
        }

        if (year) {
            where.year = year;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { reviewText: { contains: search, mode: 'insensitive' } },
                { prosText: { contains: search, mode: 'insensitive' } },
                { consText: { contains: search, mode: 'insensitive' } },
            ];
        }

        const reviews = await prisma.review.findMany({
            where,
            orderBy: {
                [sortBy]: order,
            },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST create a new review
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = ReviewSchema.parse(body);

        const review = await prisma.review.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Create review error:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
