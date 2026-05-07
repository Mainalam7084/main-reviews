import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const favorites = await prisma.$queryRaw`
            SELECT id, "userId", "movieId", "movieTitle", poster, "createdAt"
            FROM "Favorite"
            WHERE "userId" = ${userId}
            ORDER BY "createdAt" DESC
        `;

        return NextResponse.json({ favorites });
    } catch (err) {
        console.error('[GET /api/favorites]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { movieId, movieTitle, poster } = body;

        if (!movieId || !movieTitle) {
            return NextResponse.json({ error: 'movieId and movieTitle are required' }, { status: 400 });
        }

        const userId = session.user.id;
        const movieIdStr = String(movieId);
        const posterVal: string | null = poster ?? null;
        // Generate a cuid-style id using Node's built-in crypto
        const id = `fav_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        await prisma.$executeRaw`
            INSERT INTO "Favorite" (id, "userId", "movieId", "movieTitle", poster, "createdAt")
            VALUES (${id}, ${userId}, ${movieIdStr}, ${movieTitle}, ${posterVal}, NOW())
            ON CONFLICT ("userId", "movieId") DO NOTHING
        `;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/favorites]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
