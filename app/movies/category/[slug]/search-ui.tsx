'use client';

import { useState, useRef, useCallback } from 'react';
import { type Movie } from '@/lib/tmdb';
import { searchMovies } from '@/app/movies/actions';
import { MovieCard } from '@/components/ui/movie-card';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySearchProps {
    initialMovies: Movie[];
    filterLanguage?: string;
    slug: string;
    initialTotalPages?: number;
}

export function CategorySearch({
    initialMovies,
    filterLanguage,
    slug,
    initialTotalPages = 1,
}: CategorySearchProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [searchActive, setSearchActive] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        setIsSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            if (!term.trim()) {
                setMovies(initialMovies);
                setCurrentPage(1);
                setTotalPages(initialTotalPages);
                setSearchActive(false);
                setIsSearching(false);
                return;
            }

            setSearchActive(true);
            try {
                const results = await searchMovies(term, filterLanguage);
                setMovies(results);
                setTotalPages(1);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const loadMore = useCallback(async () => {
        if (isLoadingMore || currentPage >= totalPages) return;
        setIsLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const res = await fetch(`/api/movies/paginated?category=${slug}&page=${nextPage}`);
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            setMovies((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const newMovies = (data.results as Movie[]).filter((m) => !existingIds.has(m.id));
                return [...prev, ...newMovies];
            });
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, currentPage, totalPages, slug]);

    const hasMore = !searchActive && currentPage < totalPages;

    return (
        <div>
            {/* Search bar */}
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

            {/* Movie grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={movies.length > 0 ? 'grid' : 'empty'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4"
                >
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <motion.div
                                key={movie.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <MovieCard movie={movie} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 px-8 border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] bg-card text-center">
                            <h2 className="text-2xl font-display font-800 uppercase tracking-tight text-foreground mb-4">No Movies Found</h2>
                            <p className="font-500 text-muted-foreground text-lg max-w-md mx-auto">
                                No titles match your filter. Try searching for something else or browse the full collection.
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
                <div className="mt-12 flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground font-600">
                        Showing {movies.length} results · page {currentPage} of {totalPages}
                    </p>
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-3 px-8 py-4 font-display font-800 uppercase tracking-widest text-sm border-3 border-border bg-[#FFE500] text-[#0A0A0A] transition-all hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ boxShadow: isLoadingMore ? 'none' : '5px 5px 0px 0px var(--border)' }}
                    >
                        {isLoadingMore ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Loading more...
                            </>
                        ) : (
                            <>
                                <ChevronDown size={18} strokeWidth={3} />
                                Load More
                            </>
                        )}
                    </button>
                </div>
            )}

            {!hasMore && movies.length > 0 && !searchActive && currentPage > 1 && (
                <p className="mt-10 text-center text-sm text-muted-foreground font-600">
                    You&apos;ve reached the end · {movies.length} movies loaded
                </p>
            )}
        </div>
    );
}
