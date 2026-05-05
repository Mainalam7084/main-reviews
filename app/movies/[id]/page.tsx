import { getMovie, getImageUrl, getMovieCredits, getSimilarMovies } from '@/lib/tmdb';
import Image from 'next/image';
import { Star, Calendar, Clock, Film, Languages, Wallet, TrendingUp } from 'lucide-react';
import { ReviewModal } from '@/components/reviews/review-modal';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { BrutalButton } from '@/components/ui/brutal-button';
import { MovieCard } from '@/components/ui/movie-card';

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [movie, credits, similar] = await Promise.all([
        getMovie(id),
        getMovieCredits(id),
        getSimilarMovies(id)
    ]);

    const session = await getServerSession(authOptions);

    const formatCurrency = (amount: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Cinematic Movie Backdrop */}
            <div className="relative w-full min-h-[60vh] md:min-h-[80vh] overflow-hidden border-b-3 border-border bg-[#0A0A0A]">
                {/* Film Strip - Top */}
                <div className="absolute top-0 left-0 w-full h-10 md:h-14 bg-black z-30 flex items-center justify-around px-2 border-b-4 border-white/10 select-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="w-4 h-5 md:w-6 md:h-8 bg-white/5 rounded-sm border border-white/10" />
                    ))}
                </div>

                {/* Film Strip - Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-10 md:h-14 bg-black z-30 flex items-center justify-around px-2 border-t-4 border-white/10 select-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="w-4 h-5 md:w-6 md:h-8 bg-white/5 rounded-sm border border-white/10" />
                    ))}
                </div>

                {/* Cinematic Text Overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none flex flex-col justify-between py-20 md:py-28 opacity-20">
                    <div className="font-display font-900 text-[12vw] text-white/20 tracking-[1.5em] whitespace-nowrap -ml-[40vw] -rotate-1 uppercase leading-none">
                        REEL NO. {movie.id.toString().padStart(4, '0')} • FEATURE • REEL NO. {movie.id.toString().padStart(4, '0')}
                    </div>
                    <div className="font-display font-900 text-[12vw] text-white/20 tracking-[1.5em] self-end whitespace-nowrap -mr-[40vw] rotate-1 uppercase leading-none">
                        {movie.runtime || '???'} MIN • ASPECT 2.39:1 • {movie.release_date?.split('-')[0]}
                    </div>
                </div>

                {/* Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40 z-20" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-20" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-30 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                {/* Backdrop Image with Treatment */}
                {movie.backdrop_path && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={getImageUrl(movie.backdrop_path).replace('w500', 'original')}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-60 contrast-125 saturate-125 md:scale-105"
                            priority
                        />
                    </div>
                )}

                <div className="relative z-20 container mx-auto px-4 md:px-12 pt-32 pb-16 md:pt-40 md:pb-20 flex flex-col md:flex-row gap-8 lg:gap-16 items-end">
                    {/* Brutalist Poster */}
                    <div className="w-48 md:w-80 shrink-0 bg-muted border-3 border-[#F5F0E8] shadow-[12px_12px_0px_0px_#FFE500] -rotate-2 hover:rotate-0 transition-transform duration-500 hidden md:block">
                        {movie.poster_path ? (
                            <Image
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                width={400}
                                height={600}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="w-full aspect-[2/3] flex items-center justify-center font-display font-700 text-muted-foreground uppercase text-center p-4">
                                No Poster
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            {movie.tagline && (
                                <span className="inline-block bg-[#FFE500] text-[#0A0A0A] px-4 py-1 border-2 border-[#0A0A0A] font-display font-800 uppercase text-sm tracking-tighter shadow-[3px_3px_0px_0px_#0A0A0A]">
                                    {movie.tagline}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-800 tracking-tighter uppercase text-[#F5F0E8] leading-[0.85]" style={{ textShadow: '4px 4px 0px #E60000' }}>
                                {movie.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 font-display font-700 tracking-widest text-xs uppercase text-[#F5F0E8]">
                            <span className="flex items-center gap-1.5 bg-[#0A0A0A] border-2 border-[#F5F0E8] px-3 py-1 shadow-[2px_2px_0px_0px_#F5F0E8]">
                                <Calendar className="h-4 w-4" /> {movie.release_date?.split('-')[0] || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-3 py-1 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                <Star className="h-4 w-4 fill-[#0A0A0A]" /> {(movie.vote_average || 0).toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-background text-foreground border-2 border-foreground px-3 py-1 shadow-[2px_2px_0px_0px_#E60000]">
                                <Clock className="h-4 w-4" /> {movie.runtime || 0} MIN
                            </span>
                        </div>

                        <p className="max-w-4xl text-lg md:text-2xl font-500 text-[#F5F0E8]/90 font-sans leading-relaxed border-l-8 border-[#FFE500] pl-8 py-2">
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

            {/* Content Sections */}
            <main className="container mx-auto px-4 md:px-12 py-16 space-y-24">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Budget', value: formatCurrency(movie.budget), icon: Wallet, color: '#00F5A0' },
                        { label: 'Revenue', value: formatCurrency(movie.revenue), icon: TrendingUp, color: '#FFE500' },
                        { label: 'Genres', value: movie.genres?.map((g: any) => g.name).join(', '), icon: Film, color: '#E60000' },
                        { label: 'Languages', value: movie.spoken_languages?.map((l: any) => l.english_name).join(', '), icon: Languages, color: '#0066FF' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border-3 border-border p-6 shadow-[6px_6px_0px_0px_var(--border)] group hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]" style={{ backgroundColor: stat.color }}>
                                    <stat.icon size={20} className="text-[#0A0A0A]" />
                                </div>
                                <span className="font-display font-800 uppercase text-xs tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-xl font-display font-700 break-words">{stat.value || 'Unknown'}</p>
                        </div>
                    ))}
                </div>

                {/* Cast Section */}
                <section>
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-display font-800 uppercase tracking-tighter">The Cast</h2>
                        <div className="h-2 flex-1 bg-[#0A0A0A] dark:bg-[#F5F0E8]" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {credits.cast?.slice(0, 12).map((person: any) => (
                            <div key={person.id} className="group cursor-default">
                                <div className="aspect-square relative overflow-hidden border-3 border-border bg-muted shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#F5F0E8] group-hover:shadow-[6px_6px_0px_0px_#FFE500] group-hover:-translate-y-1 transition-all duration-300">
                                    {person.profile_path ? (
                                        <Image
                                            src={getImageUrl(person.profile_path)}
                                            alt={person.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center font-display font-800 text-xs text-center uppercase p-2">No Photo</div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <p className="font-display font-800 uppercase text-sm leading-tight">{person.name}</p>
                                    <p className="text-xs font-500 text-muted-foreground uppercase mt-1">{person.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Similar Movies */}
                {similar.length > 0 && (
                    <section className="pb-20">
                        <div className="mb-10 flex items-center gap-4">
                            <h2 className="text-4xl md:text-5xl font-display font-800 uppercase tracking-tighter text-[#E60000]">Similar Vibes</h2>
                            <div className="h-2 flex-1 bg-[#E60000]" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {similar.slice(0, 6).map((m: any) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

