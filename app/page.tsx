import { Navbar } from '@/components/layout/navbar';
import { getTrendingMovies, getImageUrl } from '@/lib/tmdb';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default async function Home() {
  const trendingMovies = await getTrendingMovies();

  // Define the shape of our review data since automatic inference might fail
  interface ReviewWithUser {
    id: string;
    poster: string | null;
    title: string;
    movieKey: string;
    ratingStars: number;
    reviewText: string | null;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
  }

  const recentReviews = await prisma.review.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />

          <div className="relative z-20 flex h-full flex-col justify-center px-4 md:px-16">
            <h1 className="max-w-2xl text-5xl font-bold tracking-tight md:text-7xl">
              Track. Review. <span className="text-red-600">Share.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-gray-300">
              Your personal movie journal. Rate everything you watch, write detailed reviews, and build your ultimate collection.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/movies">
                <button className="rounded-md bg-white px-8 py-3 font-bold text-black hover:bg-gray-200 transition">
                  Start Reviewing
                </button>
              </Link>
              <Link href="/about">
                <button className="rounded-md bg-gray-500/30 px-8 py-3 font-bold text-white backdrop-blur-sm hover:bg-gray-500/40 transition">
                  More Info
                </button>
              </Link>
            </div>
          </div>

          {/* Background Image Placeholder */}
          <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center" />
        </section>

        {/* Content Section */}
        <div className="px-4 md:px-16 space-y-12 py-12">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <Link href="/movies" className="text-sm font-medium text-red-500 hover:text-red-400">View All</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingMovies.slice(0, 6).map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative block transition-transform hover:scale-105">
                  <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-zinc-800">
                    {movie.poster_path ? (
                      <Image
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center p-2 text-xs text-zinc-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="truncate text-sm font-medium text-white">{movie.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.length > 0 ? (
                recentReviews.map((review: ReviewWithUser) => (
                  <div key={review.id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden">
                        {review.poster ? (
                          <Image
                            src={getImageUrl(review.poster)}
                            alt={review.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800" />
                        )}
                      </div>
                      <div>
                        <Link href={`/movies/${review.movieKey}`} className="font-bold hover:underline mb-1 block">
                          {review.title}
                        </Link>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{review.ratingStars}/5</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          by <span className="text-red-400">{review.user.name || 'Anonymous'}</span>
                        </div>
                      </div>
                    </div>
                    {review.reviewText && (
                      <p className="text-gray-300 text-sm line-clamp-3 italic">
                        "{review.reviewText}"
                      </p>
                    )}
                    <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-end">
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
          </div>
        </div>
      </main>
    </div>
  );
}
