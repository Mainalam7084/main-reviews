import {
    getTrendingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getMoviesByCountry,
    getMoviesByLanguage,
    getImageUrl,
    type Movie
} from '@/lib/tmdb';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';

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

    const MovieSection = ({ title, movies, slug }: { title: string, movies: Movie[], slug: string }) => (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6 border-l-4 border-red-600 pl-3">
                <h2 className="text-2xl font-bold text-red-600">{title}</h2>
                <Link href={`/movies/category/${slug}`}>
                    <button className="text-sm font-medium text-white hover:text-red-500 transition-colors flex items-center gap-1 group">
                        See More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.length > 0 ? (
                    movies.slice(0, 12).map((movie) => (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative block transition-transform hover:scale-105">
                            <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-zinc-800 shadow-lg">
                                {movie.poster_path ? (
                                    <Image
                                        src={getImageUrl(movie.poster_path)}
                                        alt={movie.title}
                                        width={300}
                                        height={450}
                                        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-zinc-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                <h3 className="truncate text-sm font-medium text-white group-hover:text-red-500 transition-colors">{movie.title}</h3>
                                <p className="text-xs text-gray-400">
                                    {movie.release_date?.split('-')[0] || 'N/A'} • ⭐ {(movie.vote_average || 0).toFixed(1)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No movies found for this category.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <h1 className="mb-8 text-4xl font-bold">Discover Movies</h1>

                <MovieSection title="Trending Now" movies={trending} slug="trending" />
                <MovieSection title="Top Rated Classics" movies={topRated} slug="top-rated" />
                <MovieSection title="Coming Soon" movies={upcoming} slug="upcoming" />

                <div className="my-16 border-t border-zinc-800" />
                <h2 className="mb-8 text-3xl font-bold text-white">Global Cinema</h2>

                <MovieSection title="Made in Spain 🇪🇸" movies={spanish} slug="spain" />
                <MovieSection title="Bollywood Hits (Hindi) 🇮🇳" movies={bollywood} slug="bollywood" />
                <MovieSection title="Tollywood Action (Telugu) 🇮🇳" movies={tollywood} slug="tollywood" />
                <MovieSection title="Kollywood Cinema (Tamil) 🇮🇳" movies={kollywood} slug="kollywood" />
                <MovieSection title="Mollywood Gems (Malayalam) 🇮🇳" movies={mollywood} slug="mollywood" />
                <MovieSection title="Sandalwood Favorites (Kannada) 🇮🇳" movies={sandalwood} slug="sandalwood" />
                <MovieSection title="Marathi Masterpieces 🇮🇳" movies={marathi} slug="marathi" />
            </main>
        </div>
    );
}
