import {
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getMoviesByCountry,
    getMoviesByLanguage,
} from '@/lib/tmdb';
import { ScrollRow } from '@/components/ui/scroll-row';

export default async function MoviesPage() {
    const [
        trending,
        topRated,
        upcoming,
        nowPlaying,
        spanish,
        bollywood,
        tollywood,
        kollywood,
        mollywood,
        sandalwood,
        marathi,
    ] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
        getNowPlayingMovies(),
        getMoviesByCountry('ES'),
        getMoviesByLanguage('hi'),
        getMoviesByLanguage('te'),
        getMoviesByLanguage('ta'),
        getMoviesByLanguage('ml'),
        getMoviesByLanguage('kn'),
        getMoviesByLanguage('mr'),
    ]);

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

                {/* Global cinema divider */}
                <div className="py-10 px-4 md:px-8 bg-[#FFE500] border-b-3 border-border">
                    <h2 className="text-3xl md:text-5xl font-display font-800 text-[#0A0A0A] uppercase tracking-tighter"
                        style={{ textShadow: '3px 3px 0px #FFFFFF' }}>
                        Global Hits
                    </h2>
                    <p className="font-600 text-[#0A0A0A]/70 mt-1 text-base">World cinema at your fingertips.</p>
                </div>

                <ScrollRow title="Made in Spain 🇪🇸"            movies={spanish}    viewAllHref="/movies/category/spain"       accentColor="#E60000" />
                <ScrollRow title="Bollywood Hits 🇮🇳"            movies={bollywood}  viewAllHref="/movies/category/bollywood"   accentColor="#00F5A0" />
                <ScrollRow title="Tollywood Action 🇮🇳"          movies={tollywood}  viewAllHref="/movies/category/tollywood"   accentColor="#E60000" />
                <ScrollRow title="Kollywood Cinema 🇮🇳"          movies={kollywood}  viewAllHref="/movies/category/kollywood"   accentColor="#E60000" />
                <ScrollRow title="Mollywood Gems 🇮🇳"            movies={mollywood}  viewAllHref="/movies/category/mollywood"   accentColor="#0066FF" />
                <ScrollRow title="Sandalwood Favorites 🇮🇳"      movies={sandalwood} viewAllHref="/movies/category/sandalwood"  accentColor="#FFE500" />
                <ScrollRow title="Marathi Masterpieces 🇮🇳"      movies={marathi}    viewAllHref="/movies/category/marathi"     accentColor="#00F5A0" />
            </main>
        </div>
    );
}
