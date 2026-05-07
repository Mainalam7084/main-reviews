import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ movieId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { movieId } = await params;
        const userId = session.user.id;

        await prisma.$executeRaw`
            DELETE FROM "Favorite"
            WHERE "userId" = ${userId} AND "movieId" = ${movieId}
        `;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/favorites]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
