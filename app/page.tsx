import { getTrendingMovies, getImageUrl } from '@/lib/tmdb';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { RecentReviewsSection } from '@/components/home/recent-reviews-section';
import { BrutalButton } from '@/components/ui/brutal-button';
import { MovieCard } from '@/components/ui/movie-card';

// Types
import { ReviewWithUser } from '@/components/ui/review-card';

export default async function Home() {
    const trendingMovies = await getTrendingMovies();

    // Fetch recent public reviews
    const recentReviews = await prisma.review.findMany({
        where: {
            isPublic: true,
        },
        take: 6, // Fetch 6 initially instead of 3 for the grid
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, image: true }
            }
        }
    }) as unknown as ReviewWithUser[];

    return (
        <div className="w-full">
            {/* HERO SECTION */}
            <section className="relative min-h-[70vh] w-full flex flex-col justify-center px-4 md:px-12 py-20 border-b-3 border-border bg-background">
                <div className="relative z-10 max-w-5xl mx-auto w-full">
                    <div className="space-y-4 md:space-y-6">
                        <div className="inline-block bg-[#E60000] text-white px-4 py-1 border-2 border-[#0A0A0A] font-display font-800 uppercase tracking-widest text-sm md:text-base shadow-[3px_3px_0px_0px_#0A0A0A] animate-float">
                            New V1.0 Release
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-800 tracking-tighter leading-[0.85] text-foreground uppercase">
                            Bold Cinema.
                            <br />
                            <span className="text-[#E60000]">Raw Takes.</span>
                        </h1>
                        <p className="max-w-2xl text-xl md:text-2xl font-500 text-muted-foreground font-sans mt-8">
                            The loudest movie platform on the web. Track what you watch, drop your reviews, and discover new favorites. No boring UI allowed.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-8">
                            <Link href="/movies">
                                <BrutalButton variant="primary" size="xl">
                                    Start Exploring
                                </BrutalButton>
                            </Link>
                            <Link href="/auth/register">
                                <BrutalButton variant="dark" size="xl">
                                    Join the Chaos
                                </BrutalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRENDING CAROUSEL */}
            <section className="py-16 md:py-24 border-b-3 border-border bg-background overflow-hidden">
                <div className="px-4 md:px-12 mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight text-foreground" style={{ textShadow: '3px 3px 0px var(--primary)' }}>
                            Trending Now
                        </h2>
                        <div className="h-1.5 w-24 bg-[#0A0A0A] mt-2 dark:bg-[#F5F0E8]" />
                    </div>
                    <Link href="/movies">
                        <BrutalButton variant="ghost" size="sm" className="hidden md:flex">
                            View All →
                        </BrutalButton>
                    </Link>
                </div>

                {/* Horizontal scroll container */}
                <div className="w-full overflow-x-auto pb-8 pt-4 px-4 md:px-12 snap-x-mandatory scrollbar-hide">
                    <div className="flex gap-6 w-max">
                        {trendingMovies.slice(0, 10).map((movie, index) => (
                            <div key={movie.id} className="w-[200px] md:w-[240px] shrink-0 snap-start">
                                <MovieCard movie={movie} priority={index < 4} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECENT REVIEWS */}
            <section className="py-16 md:py-24 bg-[#F5F0E8] dark:bg-[#0A0A0A]">
                <div className="px-4 md:px-12 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight text-foreground" style={{ textShadow: '3px 3px 0px var(--secondary)' }}>
                            Latest Hot Takes
                        </h2>
                        <div className="h-1.5 w-24 bg-[#0A0A0A] mt-2 dark:bg-[#F5F0E8]" />
                    </div>

                    <RecentReviewsSection initialReviews={recentReviews} />
                </div>
            </section>
        </div>
    );
}
