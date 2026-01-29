import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const migrateReviewSchema = z.object({
    movieKey: z.string(),
    movieSource: z.enum(['tmdb', 'omdb']),
    title: z.string(),
    year: z.string().optional(),
    poster: z.string().optional(),
    genres: z.array(z.string()).optional(),
    runtime: z.string().optional(),
    director: z.string().optional(),
    actors: z.array(z.string()).optional(),
    overview: z.string().optional(),
    ratingStars: z.number().min(1).max(5),
    verdict: z.string(),
    prosText: z.string().optional(),
    consText: z.string().optional(),
    reviewText: z.string().optional(),
    isPublic: z.boolean().optional(),
});

// POST migrate local review to cloud
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = migrateReviewSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: parsed.error.issues },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                movieKey: data.movieKey,
                movieSource: data.movieSource,
                title: data.title,
                year: data.year,
                poster: data.poster,
                genres: JSON.stringify(data.genres || []),
                runtime: data.runtime,
                director: data.director,
                actors: JSON.stringify(data.actors || []),
                overview: data.overview,
                ratingStars: data.ratingStars,
                verdict: data.verdict,
                prosText: data.prosText,
                consText: data.consText,
                reviewText: data.reviewText,
                isPublic: data.isPublic || false,
            },
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (error) {
        console.error('Review migration error:', error);
        return NextResponse.json(
            { message: 'Failed to migrate review' },
            { status: 500 }
        );
    }
}
