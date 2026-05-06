import { getTrendingMovies, getUpcomingMovies, getNowPlayingMovies } from '@/lib/tmdb';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { RecentReviewsSection } from '@/components/home/recent-reviews-section';
import { TrendingShowcase } from '@/components/home/trending-showcase';
import { ScrollRow } from '@/components/ui/scroll-row';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ReviewWithUser } from '@/components/ui/review-card';

export default async function Home() {
    const [trendingMovies, nowPlayingMovies, upcomingMovies] = await Promise.all([
        getTrendingMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
    ]);

    const recentReviews = await prisma.review.findMany({
        where: { isPublic: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, image: true } },
        },
    }) as unknown as ReviewWithUser[];

    return (
        <div className="w-full">
            {/* TOP 10 TRENDING SHOWCASE */}
            <TrendingShowcase movies={trendingMovies} />

            {/* TRENDING ROW */}
            <ScrollRow
                title="Trending Now"
                movies={trendingMovies}
                viewAllHref="/movies/category/trending"
                accentColor="#E60000"
            />

            {/* NOW PLAYING ROW */}
            <ScrollRow
                title="Now Playing"
                movies={nowPlayingMovies}
                viewAllHref="/movies/category/now-playing"
                accentColor="#FFE500"
            />

            {/* UPCOMING ROW */}
            <ScrollRow
                title="Coming Soon"
                movies={upcomingMovies}
                viewAllHref="/movies/category/upcoming"
                accentColor="#00F5A0"
            />

            {/* RECENT REVIEWS */}
            <section className="py-16 md:py-24 bg-[#F5F0E8] dark:bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h2
                                className="font-display font-800 text-3xl md:text-5xl uppercase tracking-tight text-foreground"
                                style={{ textShadow: '3px 3px 0px var(--secondary)' }}
                            >
                                Latest Hot Takes
                            </h2>
                            <div className="h-1.5 w-24 bg-[#0A0A0A] mt-2 dark:bg-[#F5F0E8]" />
                        </div>
                        <Link href="/public" className="hidden md:block">
                            <BrutalButton variant="ghost" size="sm">
                                All Reviews →
                            </BrutalButton>
                        </Link>
                    </div>

                    <RecentReviewsSection initialReviews={recentReviews} />
                </div>
            </section>
        </div>
    );
}
