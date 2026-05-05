import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-4">
                <div className="bg-card border-3 border-border shadow-[8px_8px_0px_0px_var(--border)] max-w-lg w-full p-8 md:p-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter mb-4 text-foreground">
                        User not found
                    </h1>
                    <p className="font-sans font-500 text-muted-foreground">
                        Please try signing out and signing in again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background min-h-screen">
            <div className="bg-[#E60000] px-4 md:px-12 py-12 md:py-16 border-b-3 border-border noise-overlay">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-display font-800 tracking-tighter uppercase text-white" style={{ textShadow: '3px 3px 0px #0A0A0A' }}>
                        Account Settings
                    </h1>
                </div>
            </div>
            
            <main className="container max-w-3xl mx-auto px-4 py-12 md:py-16">
                <AccountForm user={user} />
            </main>
        </div>
    );
}
