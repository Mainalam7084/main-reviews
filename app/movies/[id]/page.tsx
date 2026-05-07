import { getMovie, getImageUrl, getMovieCredits, getSimilarMovies, getWatchProviders, getCollection, getBackdropUrl } from '@/lib/tmdb';
import Image from 'next/image';
import { Star, Calendar, Clock, Film, Languages, Wallet, TrendingUp, Tv, ExternalLink } from 'lucide-react';
import { ReviewModal } from '@/components/reviews/review-modal';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { BrutalButton } from '@/components/ui/brutal-button';
import { MovieCard } from '@/components/ui/movie-card';
import { ScrollRow } from '@/components/ui/scroll-row';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { prisma } from '@/lib/prisma';
import { ReviewCard, type ReviewWithUser } from '@/components/ui/review-card';

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [movie, credits, similar, watchProviders] = await Promise.all([
        getMovie(id),
        getMovieCredits(id),
        getSimilarMovies(id),
        getWatchProviders(id),
    ]);

    // Collection (only fetch if movie belongs to one)
    const collection = movie.belongs_to_collection?.id
        ? await getCollection(movie.belongs_to_collection.id)
        : null;

    // Public reviews for this movie
    const movieReviews = await prisma.review.findMany({
        where: { movieKey: id, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: { user: { select: { name: true, image: true } } },
    }) as unknown as ReviewWithUser[];

    const session = await getServerSession(authOptions);

    const formatCurrency = (amount: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    // Collection movies excluding the current one
    const collectionMovies = collection?.parts
        ?.filter((m: any) => String(m.id) !== id)
        ?.sort((a: any, b: any) => (a.release_date ?? '').localeCompare(b.release_date ?? ''))
        ?? [];

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Cinematic Backdrop */}
            <div className="relative w-full min-h-[40vh] md:min-h-[60vh] overflow-hidden border-b-3 border-border bg-[#0A0A0A]">
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none flex flex-col justify-between py-16 md:py-24 opacity-10">
                    <div className="font-display font-900 text-[10vw] text-white/20 tracking-[1.5em] whitespace-nowrap -ml-[40vw] -rotate-1 uppercase leading-none">
                        REEL NO. {movie.id.toString().padStart(4, '0')} • FEATURE • REEL NO. {movie.id.toString().padStart(4, '0')}
                    </div>
                    <div className="font-display font-900 text-[10vw] text-white/20 tracking-[1.5em] self-end whitespace-nowrap -mr-[40vw] rotate-1 uppercase leading-none">
                        {movie.runtime || '???'} MIN • ASPECT 2.39:1 • {movie.release_date?.split('-')[0]}
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60 z-20" />
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-20" />

                {movie.backdrop_path && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={getBackdropUrl(movie.backdrop_path, 'original') ?? getImageUrl(movie.backdrop_path)}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-50 contrast-125 saturate-125 md:scale-105"
                            priority
                        />
                    </div>
                )}

                <div className="relative z-20 container mx-auto pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-end md:pl-10 lg:pl-18">
                    {/* Poster */}
                    <div className="w-32 sm:w-40 md:w-64 shrink-0 bg-muted border-3 border-[#F5F0E8] shadow-[8px_8px_0px_0px_#FFE500] -rotate-2 hover:rotate-0 transition-transform duration-500">
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

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-3">
                            {movie.tagline && (
                                <span className="inline-block bg-[#FFE500] text-[#0A0A0A] px-3 py-0.5 border-2 border-[#0A0A0A] font-display font-800 uppercase text-xs tracking-tighter shadow-[2px_2px_0px_0px_#0A0A0A]">
                                    {movie.tagline}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-800 tracking-tighter uppercase text-[#F5F0E8] leading-[0.9]"
                                style={{ textShadow: '3px 3px 0px #E60000' }}>
                                {movie.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 font-display font-700 tracking-widest text-[10px] uppercase text-[#F5F0E8]">
                            <span className="flex items-center gap-1.5 bg-[#0A0A0A] border-2 border-[#F5F0E8] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#F5F0E8]">
                                <Calendar className="h-3.5 w-3.5" /> {movie.release_date?.split('-')[0] || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                <Star className="h-3.5 w-3.5 fill-[#0A0A0A]" /> {(movie.vote_average || 0).toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-background text-foreground border-2 border-foreground px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#E60000]">
                                <Clock className="h-3.5 w-3.5" /> {movie.runtime || 0} MIN
                            </span>
                            {collection && (
                                <span className="flex items-center gap-1.5 bg-[#E60000] text-white border-2 border-white px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                    <Film className="h-3.5 w-3.5" /> {collection.name}
                                </span>
                            )}
                        </div>

                        <p className="max-w-3xl text-base md:text-xl font-500 text-[#F5F0E8]/90 font-sans leading-relaxed border-l-4 md:border-l-8 border-[#FFE500] pl-4 md:pl-6 py-1 text-left">
                            {movie.overview}
                        </p>

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            {session ? (
                                <ReviewModal movie={movie} />
                            ) : (
                                <Link href="/auth/login">
                                    <BrutalButton variant="primary" size="lg">
                                        Sign in to Review
                                    </BrutalButton>
                                </Link>
                            )}
                            <FavoriteButton
                                movieId={movie.id}
                                movieTitle={movie.title}
                                poster={movie.poster_path ? getImageUrl(movie.poster_path) : undefined}
                                variant="button"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <main className="container mx-auto py-16 space-y-20 md:pl-10 lg:pl-20 pr-4">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Budget',    value: formatCurrency(movie.budget),   icon: Wallet,     color: '#00F5A0' },
                        { label: 'Revenue',   value: formatCurrency(movie.revenue),  icon: TrendingUp, color: '#FFE500' },
                        { label: 'Genres',    value: movie.genres?.map((g: any) => g.name).join(', '),              icon: Film,      color: '#E60000' },
                        { label: 'Languages', value: movie.spoken_languages?.map((l: any) => l.english_name).join(', '), icon: Languages, color: '#0066FF' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border-3 border-border p-6 shadow-[6px_6px_0px_0px_var(--border)] hover:-translate-y-1 transition-transform">
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

                {/* WHERE TO WATCH */}
                {watchProviders && (watchProviders.flatrate?.length || watchProviders.rent?.length || watchProviders.buy?.length) ? (
                    <section>
                        <div className="mb-8 flex items-center gap-4">
                            <h2 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter flex items-center gap-3">
                                <Tv className="w-8 h-8 text-[#E60000]" />
                                Where to Watch
                            </h2>
                            <div className="h-2 flex-1 bg-[#E60000]" />
                        </div>

                        <div className="space-y-6">
                            {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                                        Stream
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.flatrate.map((p) => (
                                            <div
                                                key={p.provider_id}
                                                className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform"
                                                title={p.provider_name}
                                            >
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                    alt={p.provider_name}
                                                    width={28}
                                                    height={28}
                                                    className="border border-border"
                                                />
                                                <span className="font-display font-700 text-sm">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {watchProviders.rent && watchProviders.rent.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                                        Rent
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.rent.map((p) => (
                                            <div
                                                key={p.provider_id}
                                                className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform"
                                            >
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                    alt={p.provider_name}
                                                    width={28}
                                                    height={28}
                                                    className="border border-border"
                                                />
                                                <span className="font-display font-700 text-sm">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {watchProviders.buy && watchProviders.buy.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                                        Buy
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.buy.map((p) => (
                                            <div
                                                key={p.provider_id}
                                                className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform"
                                            >
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                    alt={p.provider_name}
                                                    width={28}
                                                    height={28}
                                                    className="border border-border"
                                                />
                                                <span className="font-display font-700 text-sm">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Powered by JustWatch via TMDB
                            </p>
                        </div>
                    </section>
                ) : null}

                {/* Cast Section */}
                <section>
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-display font-800 uppercase tracking-tighter">The Cast</h2>
                        <div className="h-2 flex-1 bg-[#0A0A0A] dark:bg-[#F5F0E8]" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {credits.cast?.slice(0, 12).map((person: any) => (
                            <Link key={person.id} href={`/people/${person.id}`} className="group">
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
                                    <p className="font-display font-800 uppercase text-sm leading-tight group-hover:text-primary transition-colors">{person.name}</p>
                                    <p className="text-xs font-500 text-muted-foreground uppercase mt-1">{person.character}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* COLLECTION */}
                {collection && collectionMovies.length > 0 && (
                    <section className="-mx-4 md:-mx-8 lg:-mx-20">
                        <ScrollRow
                            title={collection.name}
                            movies={collectionMovies}
                            accentColor="#FFE500"
                        />
                    </section>
                )}

                {/* SIMILAR MOVIES */}
                {similar.length > 0 && (
                    <section className="-mx-4 md:-mx-8 lg:-mx-20">
                        <ScrollRow
                            title="Similar Vibes"
                            movies={similar}
                            accentColor="#E60000"
                        />
                    </section>
                )}

                {/* PUBLIC REVIEWS FOR THIS MOVIE */}
                <section className="pb-12">
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter">
                            Community Reviews
                        </h2>
                        <div className="h-2 flex-1 bg-[#E60000]" />
                        {movieReviews.length > 0 && (
                            <span className="bg-[#E60000] text-white border-2 border-foreground px-3 py-1 font-display font-700 text-sm"
                                  style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}>
                                {movieReviews.length}
                            </span>
                        )}
                    </div>

                    {movieReviews.length === 0 ? (
                        <div className="border-3 border-border bg-card p-12 text-center"
                             style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                            <p className="font-display font-700 text-xl text-muted-foreground uppercase">
                                No reviews yet for this movie.
                            </p>
                            <p className="mt-2 text-muted-foreground text-sm">Be the first to drop a hot take!</p>
                            {!session && (
                                <div className="mt-6">
                                    <Link href="/auth/login">
                                        <BrutalButton variant="primary">Sign In to Review</BrutalButton>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {movieReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
