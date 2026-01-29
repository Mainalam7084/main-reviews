import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
    movieId: z.string(),
    movieTitle: z.string(),
    moviePoster: z.string().optional(),
    movieYear: z.string().optional(),
    rating: z.number().min(1).max(5),
    verdict: z.string(),
    text: z.string().optional(),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = reviewSchema.safeParse(body);

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
                movieKey: data.movieId,
                movieSource: 'tmdb',
                title: data.movieTitle,
                poster: data.moviePoster,
                year: data.movieYear,
                ratingStars: data.rating,
                verdict: data.verdict as any,
                reviewText: data.text,
                genres: '[]' as any, // Default empty array for SQLite compat
                actors: '[]' as any, // Default empty array for SQLite compat
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Review creation error:', error);
        return NextResponse.json(
            { message: 'Invalid input or server error' },
            { status: 400 }
        );
    }
}
