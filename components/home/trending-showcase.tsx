'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { type Movie, getBackdropUrl } from '@/lib/tmdb';

interface TrendingShowcaseProps {
    movies: Movie[];
}

export function TrendingShowcase({ movies }: TrendingShowcaseProps) {
    const top10 = movies.slice(0, 10);
    const [activeIndex, setActiveIndex] = useState(0);
    const isFirstSlide = activeIndex === 0;
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (!entry.isIntersecting) setIsPaused(false); },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const goTo = useCallback((index: number, dir: number) => {
        setDirection(dir);
        setActiveIndex(index);
    }, []);

    const next = useCallback(() => {
        goTo((activeIndex + 1) % top10.length, 1);
    }, [activeIndex, top10.length, goTo]);

    const prev = useCallback(() => {
        goTo((activeIndex - 1 + top10.length) % top10.length, -1);
    }, [activeIndex, top10.length, goTo]);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(next, 4500);
        return () => clearInterval(interval);
    }, [next, isPaused]);

    const active = top10[activeIndex];
    if (!active) return null;

    const backdropUrl = getBackdropUrl(active.backdrop_path);

    const slideVariants = {
        enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden border-b-3 border-border bg-[#0A0A0A]"
            style={{ minHeight: 'clamp(480px, 70vh, 680px)' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Backdrop layer */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={`backdrop-${active.id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                >
                    {backdropUrl ? (
                        <Image
                            src={backdropUrl}
                            alt={active.title}
                            fill
                            className="object-cover"
                            priority={isFirstSlide}
                            sizes="100vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[#141414]" />
                    )}
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A]/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center" style={{ minHeight: 'inherit' }}>
                <div className="w-full pl-6 pr-16 md:pl-12 md:pr-20 lg:pl-16 lg:pr-24 py-12">
                    <div className="flex items-end gap-6 lg:gap-12 max-w-6xl">

                        {/* Giant rank number */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`rank-${activeIndex}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.35 }}
                                className="hidden md:block shrink-0 leading-none select-none"
                            >
                                <span
                                    className="font-display font-800 text-[7rem] lg:text-[9rem] text-[#E60000]"
                                    style={{
                                        WebkitTextStroke: '3px #E60000',
                                        textShadow: '5px 5px 0px rgba(0,0,0,0.6)',
                                        lineHeight: 1,
                                    }}
                                >
                                    {String(activeIndex + 1).padStart(2, '0')}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Movie info */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`info-${active.id}`}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -25 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                className="flex flex-col gap-4 flex-1 min-w-0"
                            >
                                {/* Badges row */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="bg-[#E60000] text-white px-3 py-1 border-2 border-white font-display font-700 uppercase text-xs tracking-widest">
                                        #{activeIndex + 1} Trending
                                    </div>
                                    {active.vote_average > 0 && (
                                        <div className="flex items-center gap-1 bg-[#FFE500] text-[#0A0A0A] px-3 py-1 border-2 border-[#0A0A0A] font-display font-700 text-xs">
                                            <Star className="w-3 h-3 fill-[#0A0A0A]" />
                                            {active.vote_average.toFixed(1)}
                                        </div>
                                    )}
                                    {active.release_date && (
                                        <div className="text-white/60 font-display font-600 text-sm">
                                            {active.release_date.split('-')[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h1
                                    className="font-display font-800 text-3xl md:text-5xl lg:text-6xl text-white uppercase leading-none"
                                    style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
                                >
                                    {active.title}
                                </h1>

                                {/* Overview */}
                                {active.overview && (
                                    <p className="text-white/75 text-sm md:text-base max-w-lg leading-relaxed line-clamp-3 font-sans">
                                        {active.overview}
                                    </p>
                                )}

                                {/* CTA */}
                                <div className="flex gap-3 pt-1">
                                    <Link href={`/movies/${active.id}`}>
                                        <motion.button
                                            whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0px 0px #FFFFFF' }}
                                            whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px 0px #FFFFFF' }}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-[#E60000] text-white border-2 border-white font-display font-700 uppercase tracking-wide text-sm"
                                            style={{ boxShadow: '4px 4px 0px 0px #FFFFFF' }}
                                        >
                                            <Play className="w-4 h-4 fill-white" />
                                            View Details
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Poster (desktop only) */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`poster-${active.id}`}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.4 }}
                                className="hidden lg:block shrink-0"
                            >
                                {active.poster_path && (
                                    <Link href={`/movies/${active.id}`}>
                                        <div
                                            className="relative w-44 xl:w-52 aspect-[2/3] border-3 border-white hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
                                            style={{ boxShadow: '6px 6px 0px 0px #E60000' }}
                                        >
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w500${active.poster_path}`}
                                                alt={active.title}
                                                fill
                                                className="object-cover"
                                                sizes="208px"
                                                priority={isFirstSlide}
                                            />
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Prev/Next arrows */}
            <button
                onClick={prev}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white text-[#0A0A0A] border-3 border-[#0A0A0A] flex items-center justify-center hover:bg-[#FFE500] transition-colors"
                style={{ boxShadow: '3px 3px 0px 0px #0A0A0A' }}
                aria-label="Previous movie"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white text-[#0A0A0A] border-3 border-[#0A0A0A] flex items-center justify-center hover:bg-[#FFE500] transition-colors"
                style={{ boxShadow: '3px 3px 0px 0px #0A0A0A' }}
                aria-label="Next movie"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Number indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {top10.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                        className={`font-display font-700 text-xs w-7 h-7 border-2 flex items-center justify-center transition-all duration-200 ${
                            i === activeIndex
                                ? 'bg-[#E60000] text-white border-white scale-110'
                                : 'bg-black/40 text-white/70 border-white/30 hover:bg-white/20 hover:border-white/60'
                        }`}
                        aria-label={`Go to movie ${i + 1}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Progress bar */}
            {!isPaused && (
                <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/20">
                    <motion.div
                        key={`progress-${activeIndex}`}
                        className="h-full bg-[#E60000]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4.5, ease: 'linear' }}
                    />
                </div>
            )}
        </section>
    );
}
