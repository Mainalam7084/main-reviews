import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';

export default async function ReviewsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex h-[80vh] flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold">Please sign in to view your reviews</h1>
                    <Link href="/auth/login" className="mt-4 rounded-md bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const reviews = await prisma.review.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-red-600">My Reviews</h1>
                    <span className="text-gray-400">{reviews.length} reviews</span>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 rounded-lg border border-zinc-800">
                        <h2 className="text-xl font-semibold mb-2">No reviews yet</h2>
                        <p className="text-gray-400 mb-6">Start your collection by reviewing a movie!</p>
                        <Link href="/movies" className="inline-block bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200">
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex flex-col">
                                <div className="flex gap-4 p-4">
                                    <div className="shrink-0 w-24 aspect-[2/3] bg-zinc-800 rounded overflow-hidden relative">
                                        {review.poster ? (
                                            <Image
                                                src={getImageUrl(review.poster)}
                                                alt={review.title}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-center p-1 text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg line-clamp-1">{review.title}</h3>
                                        <p className="text-sm text-gray-400">{review.year}</p>
                                        <div className="flex items-center gap-1 mt-2 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{review.ratingStars}/5</span>
                                        </div>
                                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium bg-red-600/20 text-red-500 border border-red-600/30">
                                            {review.verdict}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 flex-1">
                                    {review.reviewText && (
                                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                                            "{review.reviewText}"
                                        </p>
                                    )}
                                    <div className="mt-auto text-xs text-gray-500 flex justify-end">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
