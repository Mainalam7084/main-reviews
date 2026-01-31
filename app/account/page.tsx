import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/navbar';
import { AccountForm } from '@/components/account/account-form';

export const metadata = {
    title: 'Account Settings - MainReviews',
};

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
    });

    if (!user) {
        // Should not happen if session is valid, but handle gracefully
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <main className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold mb-4">User not found</h1>
                    <p className="text-gray-400">Please try signing out and signing in again.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container max-w-2xl mx-auto px-4 py-24">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
                <AccountForm user={user} />
            </main>
        </div>
    );
}
