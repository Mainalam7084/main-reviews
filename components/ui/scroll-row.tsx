'use client';

import { useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '@/components/ui/movie-card';
import { BrutalButton } from '@/components/ui/brutal-button';
import { type Movie } from '@/lib/tmdb';

interface ScrollRowProps {
    title: string;
    movies: Movie[];
    viewAllHref?: string;
    accentColor?: string;
    maxItems?: number;
}

export function ScrollRow({
    title,
    movies,
    viewAllHref,
    accentColor = '#E60000',
    maxItems = 20,
}: ScrollRowProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((dir: 'left' | 'right') => {
        const el = containerRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('[data-card]')?.clientWidth ?? 200;
        const gap = 20;
        el.scrollBy({ left: dir === 'left' ? -(cardWidth + gap) * 3 : (cardWidth + gap) * 3, behavior: 'smooth' });
    }, []);

    const displayed = movies.slice(0, maxItems);

    return (
        <section className="py-10 md:py-14 border-b-3 border-border bg-background">
            {/* Header */}
            <div className="px-4 md:px-8 mb-5 flex items-center justify-between gap-4">
                <div>
                    <h2
                        className="font-display font-800 text-2xl md:text-4xl uppercase tracking-tight text-foreground"
                        style={{ textShadow: `3px 3px 0px ${accentColor}` }}
                    >
                        {title}
                    </h2>
                    <div className="h-1 w-16 mt-1.5 bg-foreground" />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => scroll('left')}
                        className="w-9 h-9 border-3 border-border bg-card flex items-center justify-center hover:bg-[#FFE500] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-9 h-9 border-3 border-border bg-card flex items-center justify-center hover:bg-[#FFE500] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    {viewAllHref && (
                        <Link href={viewAllHref} className="hidden md:block">
                            <BrutalButton variant="ghost" size="sm">
                                View All →
                            </BrutalButton>
                        </Link>
                    )}
                </div>
            </div>

            {/* Scroll container */}
            <div
                ref={containerRef}
                className="flex gap-5 overflow-x-auto pb-4 px-4 md:px-8 scrollbar-hide snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
            >
                {displayed.map((movie) => (
                    <div
                        key={movie.id}
                        data-card
                        className="w-[160px] md:w-[190px] shrink-0 snap-start"
                    >
                        <MovieCard movie={movie} />
                    </div>
                ))}
                {/* trailing spacer */}
                <div className="w-4 md:w-8 shrink-0" aria-hidden />
            </div>
        </section>
    );
}
