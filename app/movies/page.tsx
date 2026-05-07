import {
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getMoviesByLanguage,
    getMoviesByGenreAndLanguage,
    getMoviesByMultipleCountries,
    getCollection,
    POPULAR_COLLECTIONS,
} from '@/lib/tmdb';
import { ScrollRow } from '@/components/ui/scroll-row';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import { Bookmark } from 'lucide-react';

export default async function MoviesPage() {
    const [
        trending,
        topRated,
        upcoming,
        nowPlaying,
        japanese,
        korean,
        animeMovies,
        european,
        bollywood,
        tollywood,
        kollywood,
        mollywood,
    ] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
        getNowPlayingMovies(),
        getMoviesByLanguage('ja'),
        getMoviesByLanguage('ko'),
        getMoviesByGenreAndLanguage(16, 'ja'),
        getMoviesByMultipleCountries(['FR', 'DE', 'IT']),
        getMoviesByLanguage('hi'),
        getMoviesByLanguage('te'),
        getMoviesByLanguage('ta'),
        getMoviesByLanguage('ml'),
    ]);

    // Fetch popular collections
    const collections = await Promise.all(
        POPULAR_COLLECTIONS.map((c) => getCollection(c.id))
    );

    return (
        <div className="w-full">
            {/* Header */}
            <div className="py-12 md:py-16 border-b-3 border-border bg-background px-4 md:px-8">
                <div className="max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground"
                        style={{ textShadow: '4px 4px 0px var(--primary)' }}>
                        Discover Cinema
                    </h1>
                    <div className="h-1.5 w-24 bg-foreground mt-3" />
                    <p className="mt-4 text-xl font-500 text-muted-foreground max-w-2xl font-sans">
                        From trending blockbusters to global masterpieces. Find your next obsession.
                    </p>
                </div>
            </div>

            <main className="w-full">
                <ScrollRow title="Trending Now"        movies={trending}   viewAllHref="/movies/category/trending"    accentColor="#E60000" />
                <ScrollRow title="Now Playing"         movies={nowPlaying} viewAllHref="/movies/category/now-playing" accentColor="#FFE500" />
                <ScrollRow title="Coming Soon"         movies={upcoming}   viewAllHref="/movies/category/upcoming"    accentColor="#0066FF" />
                <ScrollRow title="Top Rated Classics"  movies={topRated}   viewAllHref="/movies/category/top-rated"   accentColor="#00F5A0" />

                {/* Collections banner */}
                <div className="py-10 px-4 md:px-8 bg-[#0A0A0A] border-b-3 border-border">
                    <div className="flex items-end justify-between max-w-7xl mx-auto">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#FFE500] text-[#0A0A0A] px-3 py-1 border-2 border-[#F5F0E8] font-display font-700 uppercase text-xs tracking-widest mb-3"
                                 style={{ boxShadow: '3px 3px 0px 0px #F5F0E8' }}>
                                <Bookmark size={12} /> Collections
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-800 text-white uppercase tracking-tighter"
                                style={{ textShadow: '3px 3px 0px #E60000' }}>
                                Movie Universes
                            </h2>
                            <p className="font-600 text-white/60 mt-1 text-sm">Iconic franchises, all in one place.</p>
                        </div>
                    </div>
                </div>

                {/* Collections grid */}
                <div className="px-4 md:px-8 py-10 border-b-3 border-border bg-background">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {POPULAR_COLLECTIONS.map((meta, i) => {
                            const col = collections[i];
                            if (!col) return null;
                            const backdrop = col.backdrop_path ? getBackdropUrl(col.backdrop_path, 'w780') : null;
                            const poster = col.poster_path ? getImageUrl(col.poster_path) : null;
                            return (
                                <Link
                                    key={meta.id}
                                    href={`/collections/${meta.id}`}
                                    className="group relative overflow-hidden border-3 border-border bg-card block"
                                    style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
                                >
                                    <div className="relative aspect-video w-full bg-muted">
                                        {(backdrop || poster) && (
                                            <Image
                                                src={(backdrop || poster)!}
                                                alt={col.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <p className="font-display font-800 text-white text-sm uppercase tracking-tight leading-tight">
                                                {col.name}
                                            </p>
                                            <p className="text-white/60 text-xs mt-0.5 font-600">
                                                {col.parts?.length ?? 0} films
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Global cinema divider */}
                <div className="py-10 px-4 md:px-8 bg-[#FFE500] border-b-3 border-border">
                    <h2 className="text-3xl md:text-5xl font-display font-800 text-[#0A0A0A] uppercase tracking-tighter"
                        style={{ textShadow: '3px 3px 0px #FFFFFF' }}>
                        World Cinema
                    </h2>
                    <p className="font-600 text-[#0A0A0A]/70 mt-1 text-base">Cinema without borders.</p>
                </div>

                <ScrollRow title="Japanese Cinema 🇯🇵"        movies={japanese}    viewAllHref="/movies/category/japanese"     accentColor="#E60000" />
                <ScrollRow title="Korean Cinema 🇰🇷"           movies={korean}     viewAllHref="/movies/category/korean"       accentColor="#0066FF" />
                <ScrollRow title="Anime Movies 🎌"             movies={animeMovies} viewAllHref="/movies/category/anime-movies" accentColor="#E60000" />
                <ScrollRow title="European Cinema 🇪🇺"         movies={european}   viewAllHref="/movies/category/european"     accentColor="#00F5A0" />

                {/* Indian cinema divider */}
                <div className="py-10 px-4 md:px-8 bg-[#E60000] border-b-3 border-border">
                    <h2 className="text-3xl md:text-5xl font-display font-800 text-white uppercase tracking-tighter"
                        style={{ textShadow: '3px 3px 0px #0A0A0A' }}>
                        Indian Cinema 🇮🇳
                    </h2>
                    <p className="font-600 text-white/70 mt-1 text-base">Bollywood, Tollywood & beyond.</p>
                </div>

                <ScrollRow title="Bollywood Hits 🇮🇳"          movies={bollywood}  viewAllHref="/movies/category/bollywood"   accentColor="#00F5A0" />
                <ScrollRow title="Tollywood Action 🇮🇳"         movies={tollywood}  viewAllHref="/movies/category/tollywood"   accentColor="#E60000" />
                <ScrollRow title="Kollywood Cinema 🇮🇳"         movies={kollywood}  viewAllHref="/movies/category/kollywood"   accentColor="#E60000" />
                <ScrollRow title="Mollywood Gems 🇮🇳"           movies={mollywood}  viewAllHref="/movies/category/mollywood"   accentColor="#0066FF" />
            </main>
        </div>
    );
}
