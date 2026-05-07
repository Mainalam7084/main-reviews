'use client';

import { useState, useRef, useCallback } from 'react';
import { type TVShow, getImageUrl } from '@/lib/tmdb';
import { Search, Loader2, ChevronDown, Star, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

function TVCardGrid({ show }: { show: TVShow }) {
    const poster = show.poster_path ? getImageUrl(show.poster_path) : undefined;
    return (
        <Link href={`/tv/${show.id}`} className="group block h-full">
            <div
                className="h-full flex flex-col bg-card border-3 border-border group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200"
                style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
            >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted border-b-3 border-border">
                    {poster ? (
                        <Image
                            src={poster}
                            alt={show.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Tv className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                    {show.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-[#0066FF] text-white border-2 border-[#0A0A0A] px-2 py-0.5 flex items-center gap-1 font-display font-700 text-xs shadow-[2px_2px_0px_0px_#0A0A0A]">
                            <Star className="w-3 h-3 fill-white" />
                            {show.vote_average.toFixed(1)}
                        </div>
                    )}
                    <div className="absolute top-2 left-2 bg-[#0066FF] text-white border-2 border-[#0A0A0A] px-1.5 py-0.5 font-display font-700 text-[10px] shadow-[2px_2px_0px_0px_#0A0A0A]">
                        TV
                    </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-display font-700 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {show.name}
                    </h3>
                    <div className="mt-2 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                        {show.first_air_date?.split('-')[0] || 'TBA'}
                    </div>
                </div>
            </div>
        </Link>
    );
}

interface TVCategorySearchProps {
    initialShows: TVShow[];
    slug: string;
    initialTotalPages?: number;
}

export function TVCategorySearch({ initialShows, slug, initialTotalPages = 1 }: TVCategorySearchProps) {
    const [shows, setShows] = useState<TVShow[]>(initialShows);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        setQuery(term);
        if (!term.trim()) {
            setShows(initialShows);
            setCurrentPage(1);
            setTotalPages(initialTotalPages);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&type=tv`);
                if (res.ok) {
                    const data = await res.json();
                    setShows(data.results ?? []);
                    setTotalPages(1);
                }
            } catch (err) {
                console.error(err);
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
            const res = await fetch(`/api/tv/paginated?category=${slug}&page=${nextPage}`);
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            setShows((prev) => {
                const ids = new Set(prev.map((s) => s.id));
                return [...prev, ...(data.results as TVShow[]).filter((s) => !ids.has(s.id))];
            });
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, currentPage, totalPages, slug]);

    const searchActive = !!query.trim();
    const hasMore = !searchActive && currentPage < totalPages;

    return (
        <div>
            {/* Search bar */}
            <div className="mb-16 relative max-w-2xl">
                <div className="flex flex-col md:flex-row">
                    <div className="bg-[#0066FF] text-white border-3 border-border border-b-0 md:border-b-3 md:border-r-0 px-6 py-4 font-display font-800 uppercase tracking-widest text-sm flex items-center gap-2">
                        <Search size={18} strokeWidth={3} /> Search
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Find TV shows..."
                            className="brutal-input w-full px-6 py-4 text-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-0"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {isSearching && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={shows.length > 0 ? 'grid' : 'empty'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4"
                >
                    {shows.length > 0 ? (
                        shows.map((show) => (
                            <motion.div
                                key={show.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <TVCardGrid show={show} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 px-8 border-3 border-border bg-card text-center">
                            <h2 className="text-2xl font-display font-800 uppercase tracking-tight mb-4">No Shows Found</h2>
                            <p className="font-500 text-muted-foreground text-lg max-w-md mx-auto">
                                No titles match your search. Try something else.
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
                <div className="mt-12 flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground font-600">
                        Showing {shows.length} results · page {currentPage} of {totalPages}
                    </p>
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-3 px-8 py-4 font-display font-800 uppercase tracking-widest text-sm border-3 border-border bg-[#0066FF] text-white transition-all hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ boxShadow: isLoadingMore ? 'none' : '5px 5px 0px 0px var(--border)' }}
                    >
                        {isLoadingMore ? (
                            <><Loader2 size={18} className="animate-spin" /> Loading more...</>
                        ) : (
                            <><ChevronDown size={18} strokeWidth={3} /> Load More</>
                        )}
                    </button>
                </div>
            )}

            {!hasMore && shows.length > 0 && !searchActive && currentPage > 1 && (
                <p className="mt-10 text-center text-sm text-muted-foreground font-600">
                    You&apos;ve reached the end · {shows.length} shows loaded
                </p>
            )}
        </div>
    );
}
