'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ReviewCard, type ReviewWithUser } from '@/components/ui/review-card';

interface RecentReviewsSectionProps {
    initialReviews: ReviewWithUser[];
}

const fetchReviews = async ({ pageParam = 1 }: { pageParam: number }) => {
    const res = await fetch(`/api/public-reviews?page=${pageParam}&limit=6`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

export function RecentReviewsSection({ initialReviews }: RecentReviewsSectionProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['recentReviews'],
        queryFn: fetchReviews,
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        initialData: {
            pages: [
                {
                    reviews: initialReviews,
                    pagination: {
                        page: 1,
                        limit: 6,
                        total: 100, // Placeholder
                        totalPages: 10, // Placeholder
                    }
                }
            ],
            pageParams: [1]
        }
    });

    const reviews = data?.pages.flatMap((page) => page.reviews) as ReviewWithUser[] || [];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max">
                {reviews.length > 0 ? (
                    reviews.map((review: ReviewWithUser, i) => (
                        <div key={`${review.id}-${review.createdAt}`} 
                             className="h-full"
                             style={{ 
                                 transform: `translateY(${i % 3 === 1 ? '1rem' : i % 3 === 2 ? '2rem' : '0'})` 
                             }}>
                            <ReviewCard review={review} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-3 text-center py-20 border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] bg-card">
                        <p className="font-display font-700 text-xl text-muted-foreground uppercase">No hot takes yet. Be the first!</p>
                    </div>
                )}
            </div>

            <div className="mt-20 flex justify-center">
                {hasNextPage && (
                    <BrutalButton
                        onClick={() => fetchNextPage()}
                        isLoading={isFetchingNextPage}
                        variant="primary"
                        size="lg"
                        className="min-w-[200px]"
                    >
                        Load More Takes
                    </BrutalButton>
                )}
            </div>
        </div>
    );
}
