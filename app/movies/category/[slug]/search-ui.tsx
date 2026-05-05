'use client';

import { useState, useRef } from 'react';
import { type Movie } from '@/lib/tmdb';
import { searchMovies } from '@/app/movies/actions';
import { MovieCard } from '@/components/ui/movie-card';
import { Search } from 'lucide-react';

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
            <div className="mb-16 relative max-w-2xl">
                <div className="flex flex-col md:flex-row gap-0 group">
                    <div className="bg-[#FFE500] text-[#0A0A0A] border-3 border-border border-b-0 md:border-b-3 md:border-r-0 px-6 py-4 font-display font-800 uppercase tracking-widest text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_var(--border)] md:shadow-none">
                        <Search size={18} strokeWidth={3} /> Search
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Find your favorite titles..."
                            className="brutal-input w-full px-6 py-4 text-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-0"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {isSearching && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 border-3 border-[#E60000] border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (

                    <div className="col-span-full py-20 px-8 border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] bg-card text-center">
                        <h2 className="text-2xl font-display font-800 uppercase tracking-tight text-foreground mb-4">No Movies Found</h2>
                        <p className="font-500 text-muted-foreground text-lg max-w-md mx-auto">
                            No titles match your filter. Try searching for something else or browse the full collection.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

