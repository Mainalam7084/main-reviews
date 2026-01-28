import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Testing Prisma Connection...');
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to the database.');

        const userCount = await prisma.user.count();
        console.log(`✅ User count: ${userCount}`);

    } catch (error) {
        console.error('❌ Connection failed:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
