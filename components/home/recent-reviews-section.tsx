'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { VerdictBadge } from '@/components/ui/verdict-badge';
import { RatingStars } from '@/components/ui/rating-stars';
import type { ReviewWithUser } from '@/components/ui/review-card';

function MarqueeCard({ review }: { review: ReviewWithUser }) {
    const isTV = review.movieKey.startsWith('tv_');
    const contentHref = isTV ? `/tv/${review.movieKey.slice(3)}` : `/movies/${review.movieKey}`;
    const date = new Date(review.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric',
    });

    return (
        <Link
            href={contentHref}
            className="group flex-shrink-0 w-[300px]"
            style={{ textDecoration: 'none' }}
        >
            <div className="h-[170px] flex border-3 border-border bg-card shadow-[4px_4px_0px_0px_var(--border)] group-hover:shadow-[6px_6px_0px_0px_var(--primary)] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-200 overflow-hidden">
                {/* Poster */}
                <div className="relative w-[80px] flex-shrink-0 bg-muted border-r-3 border-border overflow-hidden">
                    {review.poster ? (
                        <Image
                            src={review.poster.startsWith('http') ? review.poster : getImageUrl(review.poster)}
                            alt={review.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-display font-700 text-muted-foreground uppercase p-1 text-center leading-tight">
                            No Img
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 flex flex-col min-w-0 overflow-hidden">
                    <h3 className="font-display font-700 text-sm leading-tight line-clamp-2 text-foreground mb-1.5 group-hover:text-primary transition-colors">
                        {review.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <RatingStars value={review.ratingStars} readonly size="sm" />
                    </div>

                    <div className="mb-1.5">
                        <VerdictBadge verdict={review.verdict} size="sm" />
                    </div>

                    {review.reviewText && (
                        <p className="text-[11px] text-foreground/65 italic line-clamp-2 flex-1 leading-snug">
                            &ldquo;{review.reviewText}&rdquo;
                        </p>
                    )}

                    {review.user && (
                        <div className="flex items-center gap-1.5 mt-auto pt-1.5 border-t border-border/20">
                            {review.user.image ? (
                                <img
                                    src={review.user.image}
                                    alt={review.user.name || ''}
                                    className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                                />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-display border border-border flex-shrink-0">
                                    {review.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <span className="text-[11px] font-600 font-display truncate text-foreground/70 flex-1 min-w-0">
                                {review.user.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex-shrink-0">{date}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

interface RecentReviewsSectionProps {
    initialReviews: ReviewWithUser[];
    totalReviews: number;
}

function buildRow(items: ReviewWithUser[]): ReviewWithUser[] {
    let result = [...items];
    while (result.length < 8) result = [...result, ...items];
    return result;
}

export function RecentReviewsSection({ initialReviews }: RecentReviewsSectionProps) {
    const [row1Paused, setRow1Paused] = useState(false);
    const [row2Paused, setRow2Paused] = useState(false);

    if (initialReviews.length === 0) {
        return (
            <div className="text-center py-20 border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] bg-card mx-4 md:mx-8">
                <p className="font-display font-700 text-xl text-muted-foreground uppercase">
                    No hot takes yet. Be the first!
                </p>
            </div>
        );
    }

    const evens = initialReviews.filter((_, i) => i % 2 === 0);
    const odds = initialReviews.filter((_, i) => i % 2 !== 0);

    const row1Items = buildRow(evens.length > 0 ? evens : initialReviews);
    const row2Items = buildRow(odds.length > 0 ? odds : initialReviews);

    return (
        <div className="space-y-4">
            {/* Row 1 — scrolls left */}
            <div
                className="overflow-hidden"
                onMouseEnter={() => setRow1Paused(true)}
                onMouseLeave={() => setRow1Paused(false)}
            >
                <div
                    className={`flex gap-4 w-max animate-marquee-reviews${row1Paused ? ' paused' : ''}`}
                >
                    {[...row1Items, ...row1Items].map((review, i) => (
                        <MarqueeCard key={`r1-${review.id}-${i}`} review={review} />
                    ))}
                </div>
            </div>

            {/* Row 2 — scrolls right */}
            <div
                className="overflow-hidden"
                onMouseEnter={() => setRow2Paused(true)}
                onMouseLeave={() => setRow2Paused(false)}
            >
                <div
                    className={`flex gap-4 w-max animate-marquee-reviews-reverse${row2Paused ? ' paused' : ''}`}
                >
                    {[...row2Items, ...row2Items].map((review, i) => (
                        <MarqueeCard key={`r2-${review.id}-${i}`} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
}
