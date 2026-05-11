import {
    getTrendingMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getTrendingTV,
    getPopularTV,
} from '@/lib/tmdb';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { RecentReviewsSection } from '@/components/home/recent-reviews-section';
import { TrendingShowcase } from '@/components/home/trending-showcase';
import { ScrollRow } from '@/components/ui/scroll-row';
import { TVScrollRow } from '@/components/ui/tv-scroll-row';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ReviewWithUser } from '@/components/ui/review-card';

export default async function Home() {
    const [
        trendingMovies,
        nowPlayingMovies,
        upcomingMovies,
        trendingTV,
        popularTV,
    ] = await Promise.all([
        getTrendingMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
        getTrendingTV(),
        getPopularTV(),
    ]);

    const [rawRecentReviews, totalPublicReviews] = await Promise.all([
        prisma.review.findMany({
            where: { isPublic: true },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, image: true } },
            },
        }),
        prisma.review.count({ where: { isPublic: true } }),
    ]);
    const recentReviews = rawRecentReviews as unknown as ReviewWithUser[];

    return (
        <div className="w-full">
            {/* TOP 10 TRENDING SHOWCASE — this IS the trending section */}
            <TrendingShowcase movies={trendingMovies} />

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
                accentColor="#0066FF"
            />

            {/* TV SERIES DIVIDER */}
            <div className="py-8 px-4 md:px-8 bg-[#0066FF] border-b-3 border-border">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-800 text-white uppercase tracking-tighter"
                            style={{ textShadow: '3px 3px 0px #0A0A0A' }}>
                            TV Series
                        </h2>
                        <p className="font-600 text-white/70 mt-1 text-sm">Binge-worthy shows, trending now.</p>
                    </div>
                    <Link href="/tv">
                        <BrutalButton variant="ghost" size="sm" className="bg-white text-[#0A0A0A] border-[#0A0A0A]">
                            Browse All →
                        </BrutalButton>
                    </Link>
                </div>
            </div>

            {/* TRENDING TV ROW */}
            <TVScrollRow
                title="Trending TV"
                shows={trendingTV}
                viewAllHref="/tv/category/trending"
                accentColor="#0066FF"
            />

            {/* POPULAR TV ROW */}
            <TVScrollRow
                title="Popular Shows"
                shows={popularTV}
                viewAllHref="/tv/category/popular"
                accentColor="#00F5A0"
            />

            {/* RECENT REVIEWS */}
            <section className="py-16 md:py-24 bg-[#F5F0E8] dark:bg-[#0A0A0A] overflow-hidden">
                <div className="mb-10 flex items-end justify-between px-4 md:px-8 max-w-7xl mx-auto">
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

                <RecentReviewsSection initialReviews={recentReviews} totalReviews={totalPublicReviews} />
            </section>
        </div>
    );
}
