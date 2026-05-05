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
            <div className="mb-12 relative max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#E60000] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search in this category..."
                        className="brutal-input w-full pl-12 pr-4 py-4 text-lg bg-background text-foreground placeholder:text-muted-foreground"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {isSearching && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 border-3 border-[#E60000] border-t-transparent rounded-full animate-spin" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
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

