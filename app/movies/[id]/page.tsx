import { getMovie, getImageUrl } from '@/lib/tmdb';
import { Navbar } from '@/components/layout/navbar';
import Image from 'next/image';
import { Star, Calendar } from 'lucide-react';
import { ReviewModal } from '@/components/reviews/review-modal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = await getMovie(id);
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Backdrop */}
            <div className="relative h-[85vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                {movie.backdrop_path && (
                    <Image
                        src={getImageUrl(movie.backdrop_path).replace('w500', 'original')}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}

                <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16">
                    <div className="container mx-auto flex flex-col md:flex-row gap-8 items-end">
                        {/* Poster */}
                        <div className="hidden md:block w-48 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
                            <Image
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                width={200}
                                height={300}
                                className="w-full h-auto"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{movie.title}</h1>
                            <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
                                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {movie.release_date || 'N/A'}</span>
                                <span className="flex items-center gap-1 text-yellow-500"><Star className="h-4 w-4 fill-yellow-500" /> {(movie.vote_average || 0).toFixed(1)}</span>
                            </div>
                            <p className="max-w-2xl text-lg text-gray-200 line-clamp-3 md:line-clamp-none">{movie.overview}</p>

                            <div className="pt-4">
                                {session ? (
                                    <ReviewModal movie={movie} />
                                ) : (
                                    <Link href="/auth/login">
                                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                                            Sign in to Review
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
