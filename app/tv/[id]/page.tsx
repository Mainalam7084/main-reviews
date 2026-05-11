import {
    getTVShow,
    getTVShowCredits,
    getSimilarTVShows,
    getTVWatchProviders,
    getImageUrl,
    getBackdropUrl,
} from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';
import { TVScrollRow } from '@/components/ui/tv-scroll-row';
import { TVReviewModal } from '@/components/reviews/tv-review-modal';
import { ReviewCard, type ReviewWithUser } from '@/components/ui/review-card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import {
    Star, Calendar, Layers, Play, Tv, ExternalLink,
    Languages, Hash,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TVShowPage({ params }: PageProps) {
    const { id } = await params;

    const [show, credits, similar, watchProviders] = await Promise.all([
        getTVShow(id),
        getTVShowCredits(id),
        getSimilarTVShows(id),
        getTVWatchProviders(id),
    ]);

    if (!show) notFound();

    const cast = credits?.cast?.slice(0, 12) ?? [];
    const session = await getServerSession(authOptions);

    const tvKey = `tv_${id}`;
    const showReviews = await prisma.review.findMany({
        where: { movieKey: tvKey, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: { user: { select: { name: true, image: true } } },
    }) as unknown as ReviewWithUser[];

    const statusColors: Record<string, string> = {
        'Returning Series': '#00F5A0',
        'Ended':            '#E60000',
        'Canceled':         '#E60000',
        'In Production':    '#FFE500',
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Cinematic Backdrop */}
            <div className="relative w-full min-h-[40vh] md:min-h-[60vh] overflow-hidden border-b-3 border-border bg-[#0A0A0A]">
                {/* Decorative background text */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none flex flex-col justify-between py-16 md:py-24 opacity-10">
                    <div className="font-display font-900 text-[10vw] text-white/20 tracking-[1.5em] whitespace-nowrap -ml-[40vw] -rotate-1 uppercase leading-none">
                        SERIES NO. {show.id.toString().padStart(4, '0')} • EPISODE • SERIES NO. {show.id.toString().padStart(4, '0')}
                    </div>
                    <div className="font-display font-900 text-[10vw] text-white/20 tracking-[1.5em] self-end whitespace-nowrap -mr-[40vw] rotate-1 uppercase leading-none">
                        {show.number_of_episodes || '???'} EPS • {show.number_of_seasons || '?'} SEASONS • {show.first_air_date?.split('-')[0]}
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60 z-20" />
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-20" />

                {show.backdrop_path && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={getBackdropUrl(show.backdrop_path, 'original') ?? getImageUrl(show.backdrop_path)}
                            alt={show.name}
                            fill
                            sizes="100vw"
                            className="object-cover opacity-50 contrast-125 saturate-125 md:scale-105"
                            priority
                        />
                    </div>
                )}

                <div className="relative z-20 container mx-auto pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-end md:pl-10 lg:pl-18">
                    {/* Poster */}
                    <div className="w-32 sm:w-40 md:w-64 shrink-0 bg-muted border-3 border-[#F5F0E8] shadow-[8px_8px_0px_0px_#0066FF] -rotate-2 hover:rotate-0 transition-transform duration-500">
                        {show.poster_path ? (
                            <Image
                                src={getImageUrl(show.poster_path)}
                                alt={show.name}
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
                            {show.status && (
                                <span
                                    className="inline-block px-3 py-0.5 border-2 border-[#0A0A0A] font-display font-800 uppercase text-xs tracking-tighter shadow-[2px_2px_0px_0px_#0A0A0A]"
                                    style={{ backgroundColor: statusColors[show.status] ?? '#0066FF', color: '#0A0A0A' }}
                                >
                                    {show.status}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-800 tracking-tighter uppercase text-[#F5F0E8] leading-[0.9]"
                                style={{ textShadow: '3px 3px 0px #0066FF' }}>
                                {show.name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 font-display font-700 tracking-widest text-[10px] uppercase text-[#F5F0E8]">
                            <span className="flex items-center gap-1.5 bg-[#0A0A0A] border-2 border-[#F5F0E8] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#F5F0E8]">
                                <Calendar className="h-3.5 w-3.5" /> {show.first_air_date?.split('-')[0] || 'N/A'}
                            </span>
                            {show.vote_average > 0 && (
                                <span className="flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                    <Star className="h-3.5 w-3.5 fill-[#0A0A0A]" /> {show.vote_average.toFixed(1)}
                                </span>
                            )}
                            {show.number_of_seasons != null && (
                                <span className="flex items-center gap-1.5 bg-background text-foreground border-2 border-foreground px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#0066FF]">
                                    <Layers className="h-3.5 w-3.5" /> {show.number_of_seasons} SEASONS
                                </span>
                            )}
                            {show.number_of_episodes != null && (
                                <span className="flex items-center gap-1.5 bg-[#0066FF] text-white border-2 border-white px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#0A0A0A]">
                                    <Play className="h-3.5 w-3.5" /> {show.number_of_episodes} EPS
                                </span>
                            )}
                        </div>

                        {show.overview && (
                            <p className="max-w-3xl text-base md:text-xl font-500 text-[#F5F0E8]/90 font-sans leading-relaxed border-l-4 md:border-l-8 border-[#0066FF] pl-4 md:pl-6 py-1 text-left">
                                {show.overview}
                            </p>
                        )}

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            {session ? (
                                <TVReviewModal show={show} />
                            ) : (
                                <Link href="/auth/login">
                                    <BrutalButton variant="primary" size="lg">
                                        Sign in to Review
                                    </BrutalButton>
                                </Link>
                            )}
                            <Link href="/tv">
                                <BrutalButton variant="ghost" size="lg">
                                    ← Back to TV
                                </BrutalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <main className="container mx-auto py-16 space-y-20 md:pl-10 lg:pl-20 pr-4">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        {
                            label: 'Seasons',
                            value: show.number_of_seasons != null ? `${show.number_of_seasons} season${show.number_of_seasons !== 1 ? 's' : ''}` : 'Unknown',
                            icon: Layers,
                            color: '#0066FF',
                        },
                        {
                            label: 'Episodes',
                            value: show.number_of_episodes != null ? `${show.number_of_episodes} episodes` : 'Unknown',
                            icon: Play,
                            color: '#00F5A0',
                        },
                        {
                            label: 'Network',
                            value: show.networks?.length > 0 ? show.networks.map((n: any) => n.name).join(', ') : 'Unknown',
                            icon: Tv,
                            color: '#FFE500',
                        },
                        {
                            label: 'Language',
                            value: show.original_language?.toUpperCase() || 'Unknown',
                            icon: Languages,
                            color: '#E60000',
                        },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border-3 border-border p-6 shadow-[6px_6px_0px_0px_var(--border)] hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]" style={{ backgroundColor: stat.color }}>
                                    <stat.icon size={20} className="text-[#0A0A0A]" />
                                </div>
                                <span className="font-display font-800 uppercase text-xs tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-xl font-display font-700 break-words">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* WHERE TO WATCH */}
                {watchProviders && (watchProviders.flatrate?.length || watchProviders.rent?.length || watchProviders.buy?.length) ? (
                    <section>
                        <div className="mb-8 flex items-center gap-4">
                            <h2 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter flex items-center gap-3">
                                <Tv className="w-8 h-8 text-[#0066FF]" />
                                Where to Watch
                            </h2>
                            <div className="h-2 flex-1 bg-[#0066FF]" />
                        </div>
                        <div className="space-y-6">
                            {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">Stream</p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.flatrate.map((p) => (
                                            <div key={p.provider_id} className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform" title={p.provider_name}>
                                                <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={28} height={28} className="border border-border" />
                                                <span className="font-display font-700 text-sm">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {watchProviders.rent && watchProviders.rent.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">Rent</p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.rent.map((p) => (
                                            <div key={p.provider_id} className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform">
                                                <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={28} height={28} className="border border-border" />
                                                <span className="font-display font-700 text-sm">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {watchProviders.buy && watchProviders.buy.length > 0 && (
                                <div>
                                    <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground mb-3">Buy</p>
                                    <div className="flex flex-wrap gap-3">
                                        {watchProviders.buy.map((p) => (
                                            <div key={p.provider_id} className="flex items-center gap-2 border-3 border-border bg-card px-3 py-2 shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-transform">
                                                <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={28} height={28} className="border border-border" />
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

                {/* Seasons */}
                {show.seasons?.filter((s: any) => s.season_number > 0).length > 0 && (
                    <section>
                        <div className="mb-8 flex items-center gap-4">
                            <h2 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter flex items-center gap-3">
                                <Hash className="w-8 h-8 text-[#0066FF]" />
                                Seasons
                            </h2>
                            <div className="h-2 flex-1 bg-[#0066FF]" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {show.seasons
                                .filter((s: any) => s.season_number > 0)
                                .map((season: any) => (
                                    <div
                                        key={season.id}
                                        className="border-3 border-border bg-card shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-1 transition-transform"
                                    >
                                        <div className="relative aspect-[2/3] w-full bg-muted border-b-3 border-border overflow-hidden">
                                            {season.poster_path ? (
                                                <Image
                                                    src={getImageUrl(season.poster_path)}
                                                    alt={`Season ${season.season_number}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="150px"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center font-display font-700 text-xs text-muted-foreground uppercase">
                                                    S{season.season_number}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="font-display font-700 text-sm">Season {season.season_number}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{season.episode_count} eps</p>
                                            {season.air_date && (
                                                <p className="text-xs text-muted-foreground">{season.air_date.split('-')[0]}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Cast Section */}
                <section>
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-display font-800 uppercase tracking-tighter">The Cast</h2>
                        <div className="h-2 flex-1 bg-[#0A0A0A] dark:bg-[#F5F0E8]" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {cast.map((person: any) => (
                            <Link key={person.id} href={`/people/${person.id}`} className="group">
                                <div className="aspect-square relative overflow-hidden border-3 border-border bg-muted shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#F5F0E8] group-hover:shadow-[6px_6px_0px_0px_#0066FF] group-hover:-translate-y-1 transition-all duration-300">
                                    {person.profile_path ? (
                                        <Image
                                            src={getImageUrl(person.profile_path)}
                                            alt={person.name}
                                            fill
                                            sizes="(max-width: 639px) 50vw, (max-width: 767px) 33vw, (max-width: 1023px) 25vw, 15vw"
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

                {/* Similar Shows */}
                {similar.length > 0 && (
                    <section className="-mx-4 md:-mx-8 lg:-mx-20">
                        <TVScrollRow
                            title="Similar Vibes"
                            shows={similar}
                            accentColor="#0066FF"
                        />
                    </section>
                )}

                {/* Community Reviews */}
                <section className="pb-12">
                    <div className="mb-10 flex items-center gap-4">
                        <h2 className="text-3xl md:text-4xl font-display font-800 uppercase tracking-tighter">
                            Community Reviews
                        </h2>
                        <div className="h-2 flex-1 bg-[#0066FF]" />
                        {showReviews.length > 0 && (
                            <span
                                className="bg-[#0066FF] text-white border-2 border-foreground px-3 py-1 font-display font-700 text-sm"
                                style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}
                            >
                                {showReviews.length}
                            </span>
                        )}
                    </div>

                    {showReviews.length === 0 ? (
                        <div
                            className="border-3 border-border bg-card p-12 text-center"
                            style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
                        >
                            <p className="font-display font-700 text-xl text-muted-foreground uppercase">
                                No reviews yet for this show.
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
                            {showReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
