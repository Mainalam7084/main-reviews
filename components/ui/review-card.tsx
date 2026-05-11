import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import { BrutalCardStatic } from './brutal-card';
import { VerdictBadge } from './verdict-badge';
import { RatingStars } from './rating-stars';

export interface ReviewWithUser {
    id: string;
    movieKey: string;
    title: string;
    poster?: string | null;
    ratingStars: number;
    verdict: string;
    reviewText?: string | null;
    createdAt: Date | string;
    user?: {
        name: string | null;
        image: string | null;
    };
}

interface ReviewCardProps {
    review: ReviewWithUser;
    showUser?: boolean;
}

export function ReviewCard({ review, showUser = true }: ReviewCardProps) {
    const date = new Date(review.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const isTV = review.movieKey.startsWith('tv_');
    const contentHref = isTV
        ? `/tv/${review.movieKey.slice(3)}`
        : `/movies/${review.movieKey}`;

    return (
        <BrutalCardStatic className="flex flex-col h-full bg-card hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200">
            <div className="flex items-start gap-4 p-4 border-b-3 border-border bg-[#F5F0E8] dark:bg-[#1E1E1E]">
                <Link href={contentHref} className="shrink-0 group">
                    <div className="relative w-16 md:w-20 aspect-[2/3] bg-muted border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] group-hover:shadow-[4px_4px_0px_0px_var(--primary)] group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-all">
                        {review.poster ? (
                            <Image
                                src={review.poster.startsWith('http') ? review.poster : getImageUrl(review.poster)}
                                alt={review.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-display font-700 text-muted-foreground uppercase">
                                No Img
                            </div>
                        )}
                    </div>
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={contentHref} className="block group">
                        <h3 className="font-display font-700 text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {review.title}
                        </h3>
                    </Link>
                    
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <VerdictBadge verdict={review.verdict} size="sm" />
                    </div>
                    
                    <div className="mt-2">
                        <RatingStars value={review.ratingStars} readonly size="sm" />
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                {review.reviewText && (
                    <div className="mb-4 text-sm leading-relaxed text-foreground/90 italic font-medium relative">
                        <span className="text-[#FFE500] text-3xl absolute -top-2 -left-2 opacity-50 font-display">"</span>
                        <p className="line-clamp-4 relative z-10 pl-2">{review.reviewText}</p>
                    </div>
                )}
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/20 text-xs font-display font-600 tracking-wide">
                    {showUser && review.user ? (
                        <div className="flex items-center gap-2">
                            {review.user.image ? (
                                <img src={review.user.image} alt={review.user.name || ''} className="w-5 h-5 rounded-full border border-border" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white border border-border">
                                    {review.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <span className="truncate max-w-[100px]">{review.user.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">MainReviews</span>
                    )}
                    <span className="text-muted-foreground ml-auto">{date}</span>
                </div>
            </div>
        </BrutalCardStatic>
    );
}
