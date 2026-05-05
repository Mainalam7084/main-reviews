import {
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getMoviesByCountry,
    getMoviesByLanguage,
    type Movie
} from '@/lib/tmdb';
import Link from 'next/link';
import { MovieCard } from '@/components/ui/movie-card';
import { BrutalButton } from '@/components/ui/brutal-button';

export default async function MoviesPage() {
    const [
        trending,
        topRated,
        upcoming,
        spanish,
        bollywood, // Hindi
        tollywood, // Telugu
        kollywood, // Tamil
        mollywood, // Malayalam
        sandalwood, // Kannada
        marathi    // Marathi
    ] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
        getMoviesByCountry('ES'),
        getMoviesByLanguage('hi'),
        getMoviesByLanguage('te'),
        getMoviesByLanguage('ta'),
        getMoviesByLanguage('ml'),
        getMoviesByLanguage('kn'),
        getMoviesByLanguage('mr')
    ]);

    const MovieSection = ({ title, movies, slug, color = 'var(--primary)' }: { title: string, movies: Movie[], slug: string, color?: string }) => (
        <section className="py-12 border-b-3 border-border bg-background">
            <div className="px-4 md:px-12 mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-display font-800 text-3xl md:text-4xl uppercase tracking-tight text-foreground" style={{ textShadow: `2px 2px 0px ${color}` }}>
                        {title}
                    </h2>
                    <div className="h-1.5 w-16 bg-[#0A0A0A] mt-2 dark:bg-[#F5F0E8]" />
                </div>
                <Link href={`/movies/category/${slug}`}>
                    <BrutalButton variant="ghost" size="sm" className="hidden md:flex text-xs">
                        See More →
                    </BrutalButton>
                </Link>
            </div>
            
            <div className="w-full overflow-x-auto pb-8 pt-4 snap-x-mandatory scrollbar-hide">
                <div className="flex gap-6 w-max px-4 md:px-12 after:w-1 md:after:w-6 after:shrink-0">
                    {movies.length > 0 ? (
                        movies.slice(0, 12).map((movie) => (
                            <div key={movie.id} className="w-[180px] md:w-[220px] shrink-0 snap-start">
                                <MovieCard movie={movie} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-12 px-6 border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] bg-card text-center">
                            <p className="font-display font-700 text-lg text-muted-foreground uppercase">No movies found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    return (
        <div className="w-full">
            {/* Header section */}
            <div className="px-4 md:px-12 py-12 md:py-16 border-b-3 border-border bg-background">
                <div className="max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground">
                        Discover Cinema
                    </h1>
                    <p className="mt-4 text-xl font-500 text-muted-foreground max-w-2xl font-sans">
                        From trending blockbusters to global masterpieces. Find your next obsession.
                    </p>
                </div>
            </div>

            <main className="w-full">
                <MovieSection title="Trending Now" movies={trending} slug="trending" color="var(--primary)" />
                <MovieSection title="Top Rated Classics" movies={topRated} slug="top-rated" color="#FFE500" />
                <MovieSection title="Coming Soon" movies={upcoming} slug="upcoming" color="#0066FF" />

                <div className="px-4 md:px-12 py-16 bg-[#FFE500] border-b-3 border-border">
                    <h2 className="text-4xl md:text-6xl font-display font-800 text-[#0A0A0A] uppercase tracking-tighter" style={{ textShadow: '3px 3px 0px #FFFFFF' }}>
                        Global Hits
                    </h2>
                    <p className="font-600 text-[#0A0A0A] mt-2 text-lg">World cinema at your fingertips.</p>
                </div>

                <MovieSection title="Made in Spain 🇪🇸" movies={spanish} slug="spain" color="#E60000" />
                <MovieSection title="Bollywood Hits 🇮🇳" movies={bollywood} slug="bollywood" color="#00F5A0" />
                <MovieSection title="Tollywood Action 🇮🇳" movies={tollywood} slug="tollywood" color="#E60000" />
                <MovieSection title="Kollywood Cinema 🇮🇳" movies={kollywood} slug="kollywood" color="#E60000" />
                <MovieSection title="Mollywood Gems 🇮🇳" movies={mollywood} slug="mollywood" color="#0066FF" />
                <MovieSection title="Sandalwood Favorites 🇮🇳" movies={sandalwood} slug="sandalwood" color="#FFE500" />
                <MovieSection title="Marathi Masterpieces 🇮🇳" movies={marathi} slug="marathi" color="#00F5A0" />
            </main>
        </div>
    );
}
