import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const sortBy = searchParams.get('sortBy') || 'recent'; // recent, highest, oldest
        const search = searchParams.get('search') || '';
        const year = searchParams.get('year') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            isPublic: true,
        };

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (year) {
            where.year = year;
        }

        // Build orderBy clause
        let orderBy: any = {};
        switch (sortBy) {
            case 'highest':
                orderBy = { ratingStars: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'recent':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        // Fetch reviews with user info
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Public reviews fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch public reviews' },
            { status: 500 }
        );
    }
}
