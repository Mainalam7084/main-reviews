import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.issues },
                { status: 400 }
            );
        }

        const { name } = result.data;

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { name },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Prisma cascade delete handles related records (reviews, accounts, sessions)
        // based on schema definition: onDelete: Cascade
        await prisma.user.delete({
            where: { email: session.user.email },
        });

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
