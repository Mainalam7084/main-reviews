'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

const verdictLabels: Record<string, string> = {
    NEVER_WATCH: '🚫 Never Watch',
    WATCH: '👀 Watch',
    RECOMMEND: '👍 Recommend',
    STRONGLY_RECOMMEND: '🔥 Strongly Recommend',
    BEST_EVER: '⭐ Best Ever',
};

export default function PublicReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('recent');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [page, sortBy, search]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                sortBy,
                ...(search && { search }),
            });

            const response = await fetch(`/api/public-reviews?${params}`);
            if (response.ok) {
                const data: PublicReviewsResponse = await response.json();
                setReviews(data.reviews);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch public reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Public Reviews
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover what others are watching and recommending
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by movie title..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="highest">Highest Rated</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                {/* Reviews Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No public reviews found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all hover:scale-105"
                            >
                                {/* Movie Poster */}
                                <div className="relative h-80 bg-gray-900">
                                    {review.poster ? (
                                        <Image
                                            src={review.poster}
                                            alt={review.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-600">
                                            No Poster
                                        </div>
                                    )}
                                </div>

                                {/* Review Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                                        {review.title}
                                    </h3>
                                    {review.year && (
                                        <p className="text-gray-400 text-sm mb-2">{review.year}</p>
                                    )}

                                    {/* Rating */}
                                    <div className="mb-2">{renderStars(review.ratingStars)}</div>

                                    {/* Verdict */}
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/50">
                                            {verdictLabels[review.verdict] || review.verdict}
                                        </span>
                                    </div>

                                    {/* Review Excerpt */}
                                    {review.reviewText && (
                                        <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                                            {review.reviewText}
                                        </p>
                                    )}

                                    {/* Author & Date */}
                                    <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                                        <p>
                                            By {review.user.name || review.user.email || 'Anonymous'}
                                        </p>
                                        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-gray-800 rounded-lg">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* CTA for non-logged users */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-400 mb-4">Want to share your own reviews?</p>
                    <Link
                        href="/auth/login"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                        Sign In to Start Reviewing
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
