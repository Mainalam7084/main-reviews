'use strict';
'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Review, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming button exists
import { getImageUrl } from '@/lib/tmdb';

// Define the type to match what we get from the API and Page
export interface ReviewWithUser extends Review {
    user: {
        name: string | null;
        image: string | null;
    };
}

interface RecentReviewsSectionProps {
    initialReviews: ReviewWithUser[];
}

// Fetch function
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
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['recentReviews'],
        queryFn: fetchReviews,
        getNextPageParam: (lastPage) => {
            // API returns: { reviews: [], pagination: { page, limit, total, totalPages } }
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1, // Start fetching from page 1? No, we have page 1 as initial data?
        // Actually, if we pass initialData, we need to format it correctly for infinite query.
        // If complex, we can just use the query for *more* pages, or just standard fetching.
        // Simplest approach: Use initialData for the FIRST PAGE.
        initialData: {
            pages: [
                {
                    reviews: initialReviews,
                    pagination: {
                        page: 1,
                        limit: 3, // existing page.tsx fetched 3
                        total: 100, // We don't know total yet, but it's fine.
                        totalPages: 10, // Placeholder, will be updated on next fetch
                    }
                }
            ],
            pageParams: [1]
        }
    });

    // Flatten the pages to get all reviews
    const reviews = data?.pages.flatMap((page) => page.reviews) as ReviewWithUser[] || [];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.length > 0 ? (
                    reviews.map((review: ReviewWithUser) => (
                        <div key={`${review.id}-${review.createdAt}`} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 flex flex-col transition-all hover:bg-zinc-900/80">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden bg-zinc-800">
                                    {review.poster ? (
                                        <Image
                                            src={getImageUrl(review.poster)}
                                            alt={review.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                                            No Img
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Link href={`/movies/${review.movieKey}`} className="font-bold hover:underline mb-1 block line-clamp-1">
                                        {review.title}
                                    </Link>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{review.ratingStars}/5</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        by <span className="text-red-400">{review.user?.name || 'Anonymous'}</span>
                                    </div>
                                </div>
                            </div>

                            {review.reviewText && (
                                <p className="text-gray-300 text-sm line-clamp-3 italic mb-4">
                                    "{review.reviewText}"
                                </p>
                            )}

                            <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-end border-t border-zinc-800/50">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-3 text-center text-gray-500 py-10 bg-zinc-900/50 rounded-lg">
                        <p>No reviews yet. Be the first to add one!</p>
                    </div>
                )}
            </div>

            <div className="mt-10 flex justify-center">
                {hasNextPage && (
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-red-600 hover:bg-red-700 text-white min-w-[150px]"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
