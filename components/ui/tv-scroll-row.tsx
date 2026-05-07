'use client';

import { useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BrutalButton } from './brutal-button';
import { getImageUrl, type TVShow } from '@/lib/tmdb';

interface TVScrollRowProps {
    title: string;
    shows: TVShow[];
    viewAllHref?: string;
    accentColor?: string;
    maxItems?: number;
}

function TVCard({ show, priority = false }: { show: TVShow; priority?: boolean }) {
    const poster = show.poster_path ? getImageUrl(show.poster_path) : undefined;

    return (
        <Link href={`/tv/${show.id}`} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                            sizes="(max-width: 768px) 50vw, 200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={priority}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center">
                            <Tv className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}

                    {/* Rating badge */}
                    {show.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-[#0066FF] text-white border-2 border-[#0A0A0A] px-2 py-0.5 flex items-center gap-1 font-display font-700 text-xs shadow-[2px_2px_0px_0px_#0A0A0A]">
                            <Star className="w-3 h-3 fill-white" />
                            {(show.vote_average || 0).toFixed(1)}
                        </div>
                    )}

                    {/* TV badge */}
                    <div className="absolute top-2 left-2 bg-[#0066FF] text-white border-2 border-[#0A0A0A] px-1.5 py-0.5 font-display font-700 text-[10px] shadow-[2px_2px_0px_0px_#0A0A0A]">
                        TV
                    </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between bg-card">
                    <h3 className="font-display font-700 text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
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

export function TVScrollRow({
    title,
    shows,
    viewAllHref,
    accentColor = '#0066FF',
    maxItems = 20,
}: TVScrollRowProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((dir: 'left' | 'right') => {
        const el = containerRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('[data-card]')?.clientWidth ?? 200;
        const gap = 20;
        el.scrollBy({ left: dir === 'left' ? -(cardWidth + gap) * 3 : (cardWidth + gap) * 3, behavior: 'smooth' });
    }, []);

    const displayed = shows.slice(0, maxItems);

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
                {displayed.map((show) => (
                    <div
                        key={show.id}
                        data-card
                        className="w-[160px] md:w-[190px] shrink-0 snap-start"
                    >
                        <TVCard show={show} />
                    </div>
                ))}
                <div className="w-4 md:w-8 shrink-0" aria-hidden />
            </div>
        </section>
    );
}
