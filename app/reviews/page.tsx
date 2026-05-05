import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReviewCard, type ReviewWithUser } from '@/components/ui/review-card';
import { BrutalButton } from '@/components/ui/brutal-button';

export default async function ReviewsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="bg-card border-3 border-border shadow-[8px_8px_0px_0px_var(--border)] max-w-lg w-full p-8 md:p-12 text-center">
                    <div className="w-16 h-16 bg-[#FFE500] border-2 border-border flex items-center justify-center mx-auto mb-6 text-3xl shadow-[4px_4px_0px_0px_var(--border)] rotate-3">
                        🔒
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter mb-4 text-foreground">
                        Lockout
                    </h1>
                    <p className="font-sans font-500 text-muted-foreground mb-8 text-lg">
                        You need to be signed in to view your hot takes and movie diary.
                    </p>
                    <Link href="/auth/login">
                        <BrutalButton variant="primary" size="lg" fullWidth>
                            Sign In Now
                        </BrutalButton>
                    </Link>
                </div>
            </div>
        );
    }

    const reviews = await prisma.review.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // We don't necessarily need the user populated for 'My Reviews', but ReviewCard expects it or handles it.
    // Let's pass it anyway or let ReviewCard handle the fallback
    const mappedReviews = reviews.map(r => ({
        ...r,
        user: { name: session.user?.name || 'Me', image: session.user?.image || null }
    })) as unknown as ReviewWithUser[];

    return (
        <div className="w-full bg-background min-h-screen">
            {/* Header section */}
            <div className="bg-[#E60000] px-4 md:px-12 py-12 md:py-20 border-b-3 border-border noise-overlay relative overflow-hidden">
                <div className="relative z-10 max-w-5xl flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-[#F5F0E8] leading-none" style={{ textShadow: '4px 4px 0px #0A0A0A' }}>
                            My Takes
                        </h1>
                        <p className="mt-4 text-xl font-600 text-[#F5F0E8] max-w-2xl font-sans" style={{ textShadow: '1px 1px 0px #0A0A0A' }}>
                            Your personal cinematic diary. Unfiltered and unashamed.
                        </p>
                    </div>
                    <div className="bg-[#FFE500] text-[#0A0A0A] border-3 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] px-6 py-4 flex flex-col items-center justify-center rotate-2">
                        <span className="font-display font-800 text-4xl">{reviews.length}</span>
                        <span className="font-display font-700 text-xs uppercase tracking-widest">Reviews</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-12 py-12 md:py-16">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 md:py-32 bg-card border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] max-w-2xl mx-auto">
                        <div className="text-5xl mb-6 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 inline-block">
                            🍿
                        </div>
                        <h2 className="text-3xl font-display font-800 uppercase tracking-tight mb-4">Nothing here yet</h2>
                        <p className="text-muted-foreground font-sans text-lg mb-8 max-w-md mx-auto">
                            Your diary is empty. Time to watch a movie and drop your first review.
                        </p>
                        <Link href="/movies">
                            <BrutalButton variant="primary" size="lg">
                                Discover Movies
                            </BrutalButton>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max">
                        {mappedReviews.map((review, i) => (
                            <div key={review.id} 
                                 className="h-full"
                                 style={{ 
                                     transform: `translateY(${i % 3 === 1 ? '1rem' : i % 3 === 2 ? '2rem' : '0'})` 
                                 }}>
                                <ReviewCard review={review} showUser={false} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
