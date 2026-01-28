'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, type Movie } from '@/lib/tmdb';
import { searchMovies } from '@/app/movies/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function CategorySearch({
    initialMovies,
    filterLanguage
}: {
    initialMovies: Movie[],
    filterLanguage?: string
}) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        setIsSearching(true);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(async () => {
            if (!term.trim()) {
                setMovies(initialMovies);
                setIsSearching(false);
                return;
            }

            try {
                const results = await searchMovies(term, filterLanguage);
                setMovies(results);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce
    };

    return (
        <div>
            <div className="mb-8 relative">
                <input
                    type="text"
                    placeholder="Search in this category..."
                    className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isSearching && (
                    <div className="absolute top-3 right-3 md:left-[26rem] md:right-auto w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                )}
            </div>

            <motion.div
                layout
                className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
                <AnimatePresence mode='popLayout'>
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <motion.div
                                layout
                                key={movie.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link href={`/movies/${movie.id}`} className="group relative block transition-transform hover:scale-105">
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
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-10 text-center text-gray-500"
                        >
                            No movies found.
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
