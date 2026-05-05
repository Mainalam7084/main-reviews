import { getMovie, getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';
import { Star, Calendar, Clock } from 'lucide-react';
import { ReviewModal } from '@/components/reviews/review-modal';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { BrutalButton } from '@/components/ui/brutal-button';

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = await getMovie(id);
    const session = await getServerSession(authOptions);

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Backdrop Header */}
            <div className="relative w-full overflow-hidden border-b-3 border-border">
                <div className="absolute inset-0 bg-[#E60000] mix-blend-multiply z-10 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
                
                {movie.backdrop_path && (
                    <Image
                        src={getImageUrl(movie.backdrop_path).replace('w500', 'original')}
                        alt={movie.title}
                        fill
                        className="object-cover grayscale mix-blend-overlay"
                        priority
                    />
                )}

                <div className="relative z-20 container mx-auto px-4 md:px-12 pt-32 pb-16 md:pt-48 md:pb-24 flex flex-col md:flex-row gap-8 lg:gap-16 items-end">
                    {/* Brutalist Poster */}
                    <div className="w-48 md:w-64 shrink-0 bg-muted border-3 border-[#F5F0E8] shadow-[8px_8px_0px_0px_#E60000] rotate-2 hover:rotate-0 transition-transform duration-300">
                        {movie.poster_path ? (
                            <Image
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                width={300}
                                height={450}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="w-full aspect-[2/3] flex items-center justify-center font-display font-700 text-muted-foreground uppercase text-center p-4">
                                No Poster
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-6">
                        <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-[#F5F0E8] leading-[0.9]" style={{ textShadow: '4px 4px 0px #E60000' }}>
                            {movie.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 font-display font-700 tracking-widest text-xs uppercase text-[#F5F0E8]">
                            <span className="flex items-center gap-1.5 bg-[#0A0A0A] border-2 border-[#F5F0E8] px-3 py-1 shadow-[2px_2px_0px_0px_#F5F0E8]">
                                <Calendar className="h-4 w-4" /> {movie.release_date?.split('-')[0] || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-3 py-1 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                <Star className="h-4 w-4 fill-[#0A0A0A]" /> {(movie.vote_average || 0).toFixed(1)}
                            </span>
                        </div>

                        <p className="max-w-3xl text-lg md:text-xl font-500 text-[#F5F0E8]/90 font-sans leading-relaxed border-l-4 border-[#FFE500] pl-6 py-2 bg-[#0A0A0A]/40 backdrop-blur-sm">
                            {movie.overview}
                        </p>

                        <div className="pt-6 flex flex-wrap gap-4">
                            {session ? (
                                <ReviewModal movie={movie} />
                            ) : (
                                <Link href="/auth/login">
                                    <BrutalButton variant="primary" size="xl">
                                        Sign in to Review
                                    </BrutalButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Additional content could go here, like cast or similar movies */}
        </div>
    );
}
