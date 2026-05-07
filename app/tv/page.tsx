import {
    getTrendingTV,
    getPopularTV,
    getTopRatedTV,
    getTVShowsByGenre,
} from '@/lib/tmdb';
import { TVScrollRow } from '@/components/ui/tv-scroll-row';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';
import { Tv } from 'lucide-react';

export default async function TVPage() {
    const [trending, popular, topRated, drama, anime, crime, comedy] = await Promise.all([
        getTrendingTV(),
        getPopularTV(),
        getTopRatedTV(),
        getTVShowsByGenre(18),   // Drama
        getTVShowsByGenre(16),   // Anime / Animation
        getTVShowsByGenre(80),   // Crime
        getTVShowsByGenre(35),   // Comedy
    ]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="py-12 md:py-16 border-b-3 border-border bg-background px-4 md:px-8 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-border opacity-10 bg-[#0066FF] pointer-events-none"
                     style={{ boxShadow: '8px 8px 0px 0px var(--border)' }} />
                <div className="max-w-5xl relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[#0066FF] text-white px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest mb-4"
                         style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                        <Tv size={12} /> TV Series
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground"
                        style={{ textShadow: '4px 4px 0px #0066FF' }}>
                        Binge-Worthy<br />Series
                    </h1>
                    <div className="h-1.5 w-24 bg-foreground mt-3" />
                    <p className="mt-4 text-xl font-500 text-muted-foreground max-w-2xl font-sans">
                        From epic dramas to hilarious comedies. Discover your next obsession.
                    </p>
                </div>
            </div>

            <main className="w-full">
                <TVScrollRow title="Trending This Week"  shows={trending}  viewAllHref="/tv/category/trending"  accentColor="#E60000" />
                <TVScrollRow title="Popular Now"         shows={popular}   viewAllHref="/tv/category/popular"   accentColor="#FFE500" />
                <TVScrollRow title="Top Rated Series"    shows={topRated}  viewAllHref="/tv/category/top-rated" accentColor="#00F5A0" />

                {/* Genre divider */}
                <div className="py-10 px-4 md:px-8 bg-[#0066FF] border-b-3 border-border">
                    <h2 className="text-3xl md:text-5xl font-display font-800 text-white uppercase tracking-tighter"
                        style={{ textShadow: '3px 3px 0px #0A0A0A' }}>
                        By Genre
                    </h2>
                    <p className="font-600 text-white/70 mt-1 text-sm">Browse by what you&apos;re in the mood for.</p>
                </div>

                <TVScrollRow title="Drama Series"  shows={drama}  viewAllHref="/tv/category/drama"  accentColor="#0066FF" />
                <TVScrollRow title="Anime ⛩️"       shows={anime}  viewAllHref="/tv/category/anime"  accentColor="#E60000" />
                <TVScrollRow title="Crime & Mystery" shows={crime}  viewAllHref="/tv/category/crime"  accentColor="#0A0A0A" />
                <TVScrollRow title="Comedy Shows"  shows={comedy} viewAllHref="/tv/category/comedy" accentColor="#FFE500" />
            </main>
        </div>
    );
}
