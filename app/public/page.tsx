'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, ChevronLeft, ChevronRight, SortAsc } from 'lucide-react';
import { BrutalButton } from '@/components/ui/brutal-button';

interface Review {
    id: string;
    title: string;
    poster?: string;
    year?: string;
    ratingStars: number;
    verdict: string;
    reviewText?: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
    };
}

interface PublicReviewsResponse {
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const VERDICT_LABELS: Record<string, { label: string; bg: string; text: string }> = {
    NEVER_WATCH:       { label: 'Never Watch',       bg: '#0A0A0A', text: '#F5F0E8' },
    WATCH:             { label: 'Watch',             bg: '#E8E3DB', text: '#0A0A0A' },
    RECOMMEND:         { label: 'Recommend',         bg: '#FFE500', text: '#0A0A0A' },
    STRONGLY_RECOMMEND:{ label: 'Strongly Recommend',bg: '#E60000', text: '#FFFFFF' },
    BEST_EVER:         { label: 'Best Ever',         bg: '#00F5A0', text: '#0A0A0A' },
};

const SORT_OPTIONS = [
    { value: 'recent',  label: 'Most Recent' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'oldest',  label: 'Oldest' },
];

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= rating ? 'fill-[#FFE500] text-[#0A0A0A]' : 'fill-none text-muted-foreground'}`}
                    strokeWidth={s <= rating ? 1 : 1.5}
                />
            ))}
        </div>
    );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
    const verdict = VERDICT_LABELS[review.verdict] ?? { label: review.verdict, bg: '#E8E3DB', text: '#0A0A0A' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            className="group bg-card border-3 border-border flex flex-col h-full hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
            style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
        >
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted border-b-3 border-border">
                {review.poster ? (
                    <Image
                        src={review.poster}
                        alt={review.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <span className="font-display font-700 text-muted-foreground uppercase text-xs tracking-widest">
                            No Poster
                        </span>
                    </div>
                )}
                {/* Rating overlay */}
                <div className="absolute top-2 right-2 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-2 py-0.5 flex items-center gap-1 font-display font-700 text-xs shadow-[2px_2px_0px_0px_#0A0A0A]">
                    <Star className="w-3 h-3 fill-[#0A0A0A]" />
                    {review.ratingStars}/5
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <h3 className="font-display font-700 text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {review.title}
                    </h3>
                    {review.year && (
                        <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mt-1">
                            {review.year}
                        </p>
                    )}
                </div>

                <RatingStars rating={review.ratingStars} />

                {/* Verdict badge */}
                <div>
                    <span
                        className="inline-block px-2 py-0.5 text-xs font-display font-700 uppercase tracking-wide border-2 border-border"
                        style={{ backgroundColor: verdict.bg, color: verdict.text }}
                    >
                        {verdict.label}
                    </span>
                </div>

                {/* Review excerpt */}
                {review.reviewText && (
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 font-sans flex-1">
                        &ldquo;{review.reviewText}&rdquo;
                    </p>
                )}

                {/* Author */}
                <div className="border-t-2 border-border pt-3 mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#E60000] border-2 border-border flex items-center justify-center shrink-0">
                            <span className="text-white font-display font-700 text-xs uppercase">
                                {(review.user.name || review.user.email || 'A')[0]}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-700 font-display truncate">
                                {review.user.name || review.user.email || 'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PublicReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState('recent');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                sortBy,
                ...(search && { search }),
            });
            const res = await fetch(`/api/public-reviews?${params}`);
            if (res.ok) {
                const data: PublicReviewsResponse = await res.json();
                setReviews(data.reviews);
                setTotalPages(data.pagination.totalPages);
                setTotal(data.pagination.total);
            }
        } catch (err) {
            console.error('Failed to fetch public reviews:', err);
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, search]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleSort = (value: string) => {
        setSortBy(value);
        setPage(1);
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* PAGE HEADER */}
            <div className="border-b-3 border-border bg-background py-10 md:py-14 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-2 inline-block bg-[#E60000] text-white px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest"
                         style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                        Community
                    </div>
                    <h1
                        className="font-display font-800 text-4xl md:text-6xl uppercase tracking-tight text-foreground mt-3"
                        style={{ textShadow: '4px 4px 0px var(--primary)' }}
                    >
                        Public Reviews
                    </h1>
                    <div className="h-1.5 w-28 bg-foreground mt-3" />
                    {total > 0 && (
                        <p className="mt-3 text-muted-foreground font-sans text-sm">
                            {total.toLocaleString()} reviews from the community
                        </p>
                    )}
                </div>
            </div>

            {/* FILTERS BAR */}
            <div className="border-b-3 border-border bg-card px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                        <div className="flex-1 flex border-3 border-border bg-background"
                             style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                            <input
                                type="text"
                                placeholder="Search by movie title..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-1 px-4 py-2 bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground outline-none"
                            />
                        </div>
                        <BrutalButton type="submit" variant="primary" size="sm" className="shrink-0">
                            <Search className="w-4 h-4" />
                        </BrutalButton>
                    </form>

                    {/* Sort */}
                    <div className="flex items-center gap-2 shrink-0">
                        <SortAsc className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="border-3 border-border bg-background"
                             style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="px-3 py-2 bg-transparent font-display font-700 text-sm text-foreground outline-none cursor-pointer uppercase tracking-wide appearance-none pr-6"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear search */}
                    {search && (
                        <BrutalButton
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                            className="shrink-0"
                        >
                            Clear ✕
                        </BrutalButton>
                    )}
                </div>
            </div>

            {/* REVIEWS GRID */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="border-3 border-border bg-card animate-pulse">
                                <div className="aspect-[2/3] bg-muted border-b-3 border-border" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-muted w-3/4" />
                                    <div className="h-3 bg-muted w-1/2" />
                                    <div className="h-3 bg-muted w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="border-3 border-border bg-card p-16 text-center"
                         style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                        <p className="font-display font-700 text-2xl text-muted-foreground uppercase">
                            {search ? `No reviews found for "${search}"` : 'No public reviews yet'}
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">Be the first to share your take!</p>
                        <div className="mt-6">
                            <Link href="/auth/login">
                                <BrutalButton variant="primary" size="lg">
                                    Start Reviewing
                                </BrutalButton>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${page}-${sortBy}-${search}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                        >
                            {reviews.map((review, i) => (
                                <ReviewCard key={review.id} review={review} index={i} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && !loading && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <BrutalButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </BrutalButton>

                        <div className="flex gap-1.5">
                            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                                const pageNum = totalPages <= 7
                                    ? i + 1
                                    : page <= 4
                                        ? i + 1
                                        : page >= totalPages - 3
                                            ? totalPages - 6 + i
                                            : page - 3 + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-9 h-9 border-3 border-border font-display font-700 text-sm transition-all ${
                                            pageNum === page
                                                ? 'bg-[#E60000] text-white -translate-y-0.5 -translate-x-0.5'
                                                : 'bg-card text-foreground hover:bg-[#FFE500] hover:-translate-y-0.5'
                                        }`}
                                        style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <BrutalButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </BrutalButton>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 border-3 border-border bg-[#FFE500] p-8 text-center"
                     style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                    <h3 className="font-display font-800 text-2xl md:text-3xl uppercase text-[#0A0A0A]">
                        Got a hot take?
                    </h3>
                    <p className="mt-2 text-[#0A0A0A]/70 font-sans text-sm">
                        Sign in and drop your review. Be brutally honest.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/auth/login">
                            <BrutalButton variant="dark" size="lg">
                                Sign In to Review
                            </BrutalButton>
                        </Link>
                        <Link href="/auth/register">
                            <BrutalButton variant="ghost" size="lg">
                                Create Account
                            </BrutalButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
