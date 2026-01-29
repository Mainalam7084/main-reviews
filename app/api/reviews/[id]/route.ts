import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';

const ReviewUpdateSchema = z.object({
    title: z.string().optional(),
    year: z.string().optional(),
    poster: z.string().optional(),
    genres: z.array(z.string()).optional(),
    runtime: z.string().optional(),
    director: z.string().optional(),
    actors: z.array(z.string()).optional(),
    overview: z.string().optional(),
    ratingStars: z.number().min(1).max(5).optional(),
    verdict: z.enum(['NEVER_WATCH', 'WATCH', 'RECOMMEND', 'STRONGLY_RECOMMEND', 'BEST_EVER']).optional(),
    prosText: z.string().optional(),
    consText: z.string().optional(),
    reviewText: z.string().optional(),
});

// GET a single review
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const review = await prisma.review.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Get review error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch review' },
            { status: 500 }
        );
    }
}

// PATCH update a review
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
<<<<<<< HEAD
        const parsed = ReviewUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: parsed.error.issues },
                { status: 400 }
            );
        }

        const validatedData = parsed.data;
=======
        const validatedData = ReviewUpdateSchema.parse(body);
>>>>>>> 132b2a07c3ae41f3acf59fcde857a8b1a4ccd4fa

        const review = await prisma.review.updateMany({
            where: {
                id,
                userId: session.user.id,
            },
<<<<<<< HEAD
            data: validatedData as any,
=======
            data: validatedData,
>>>>>>> 132b2a07c3ae41f3acf59fcde857a8b1a4ccd4fa
        });

        if (review.count === 0) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        const updatedReview = await prisma.review.findUnique({
            where: { id },
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
<<<<<<< HEAD
=======
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }

>>>>>>> 132b2a07c3ae41f3acf59fcde857a8b1a4ccd4fa
        console.error('Update review error:', error);
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        );
    }
}

// DELETE a review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const review = await prisma.review.deleteMany({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (review.count === 0) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete review error:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
