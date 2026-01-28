import { searchMovies, getImageUrl } from '@/lib/tmdb';
import { Navbar } from '@/components/layout/navbar';
import Link from 'next/link';
import Image from 'next/image';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const movies = await searchMovies(q);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <h1 className="mb-8 text-3xl font-bold">
                    Search Results for <span className="text-red-600">"{q}"</span>
                </h1>

                {movies.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <p className="text-xl">No movies found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {movies.map((movie) => (
                            <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative block transition-transform hover:scale-105">
                                <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-zinc-800">
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
                                    <h3 className="truncate text-sm font-medium text-white">{movie.title}</h3>
                                    <p className="text-xs text-gray-400">
                                        {movie.release_date?.split('-')[0] || 'N/A'} • ⭐ {(movie.vote_average || 0).toFixed(1)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
