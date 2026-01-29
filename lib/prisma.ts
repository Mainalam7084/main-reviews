import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Only initialize Prisma if DATABASE_URL is present
const initPrisma = () => {
    if (!process.env.DATABASE_URL) {
        return null;
    }

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

export const prisma = globalForPrisma.prisma ?? initPrisma();

if (process.env.NODE_ENV !== 'production' && prisma) {
    globalForPrisma.prisma = prisma;
}

// Helper to check if DB is available
export const hasDatabase = () => !!process.env.DATABASE_URL;
