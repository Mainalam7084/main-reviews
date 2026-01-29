import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ReviewUpdateSchema = z.object({
    title: z.string().optional(),
    year: z.string().optional(),
    poster: z.string().optional(),
    genres: z.string().optional(),
    runtime: z.string().optional(),
    director: z.string().optional(),
    actors: z.string().optional(),
    overview: z.string().optional(),
    ratingStars: z.number().min(1).max(5).optional(),
    verdict: z.string().optional(),
    prosText: z.string().optional(),
    consText: z.string().optional(),
    reviewText: z.string().optional(),
    isPublic: z.boolean().optional(),
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
        const parsed = ReviewUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: parsed.error.issues },
                { status: 400 }
            );
        }

        const validatedData = parsed.data;

        // Verify ownership
        const existingReview = await prisma.review.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found or unauthorized' },
                { status: 404 }
            );
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
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

        // Verify ownership
        const existingReview = await prisma.review.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found or unauthorized' },
                { status: 404 }
            );
        }

        await prisma.review.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete review error:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
