import { getTVShow, getTVShowCredits, getSimilarTVShows, getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';
import { TVScrollRow } from '@/components/ui/tv-scroll-row';
import { ArrowLeft, Star, Tv, Calendar, Users, Layers, Play } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TVShowPage({ params }: PageProps) {
    const { id } = await params;

    const [show, credits, similar] = await Promise.all([
        getTVShow(id),
        getTVShowCredits(id),
        getSimilarTVShows(id),
    ]);

    if (!show) notFound();

    const backdropUrl = getBackdropUrl(show.backdrop_path, 'w1280');
    const posterUrl = show.poster_path ? getImageUrl(show.poster_path, 'w500') : null;
    const cast = credits?.cast?.slice(0, 12) ?? [];

    const statusColors: Record<string, string> = {
        'Returning Series': '#00F5A0',
        'Ended':            '#E60000',
        'Canceled':         '#E60000',
        'In Production':    '#FFE500',
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Backdrop hero */}
            <div className="relative w-full" style={{ minHeight: '60vh' }}>
                {backdropUrl && (
                    <Image
                        src={backdropUrl}
                        alt={show.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-end px-4 md:px-8 pb-10 pt-24">
                    {/* Poster */}
                    {posterUrl && (
                        <div
                            className="hidden md:block shrink-0 w-52 border-4 border-border"
                            style={{ boxShadow: '8px 8px 0px 0px var(--border)' }}
                        >
                            <Image
                                src={posterUrl}
                                alt={show.name}
                                width={208}
                                height={312}
                                className="block w-full"
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        {/* Back link */}
                        <Link href="/tv" className="inline-flex mb-4">
                            <BrutalButton variant="ghost" size="sm" className="text-xs bg-background/80">
                                <ArrowLeft size={14} /> Back to TV
                            </BrutalButton>
                        </Link>

                        {/* Status badge */}
                        {show.status && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest mb-3 ml-2"
                                 style={{
                                     backgroundColor: statusColors[show.status] ?? '#FFE500',
                                     color: '#0A0A0A',
                                     boxShadow: '3px 3px 0px 0px var(--border)',
                                 }}>
                                <Tv size={11} /> {show.status}
                            </div>
                        )}

                        <h1 className="text-4xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground leading-none"
                            style={{ textShadow: '4px 4px 0px #0066FF' }}>
                            {show.name}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            {show.vote_average > 0 && (
                                <div className="flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] border-2 border-border px-3 py-1 font-display font-700"
                                     style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                                    <Star size={14} className="fill-[#0A0A0A]" />
                                    {show.vote_average.toFixed(1)} / 10
                                </div>
                            )}
                            {show.first_air_date && (
                                <div className="flex items-center gap-1.5 text-muted-foreground font-600">
                                    <Calendar size={14} />
                                    {show.first_air_date.split('-')[0]}
                                </div>
                            )}
                            {show.number_of_seasons != null && (
                                <div className="flex items-center gap-1.5 text-muted-foreground font-600">
                                    <Layers size={14} />
                                    {show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}
                                </div>
                            )}
                            {show.number_of_episodes != null && (
                                <div className="flex items-center gap-1.5 text-muted-foreground font-600">
                                    <Play size={14} />
                                    {show.number_of_episodes} episodes
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {show.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {show.genres.map((g: { id: number; name: string }) => (
                                    <span
                                        key={g.id}
                                        className="px-3 py-1 border-2 border-border font-display font-700 text-xs uppercase tracking-wider bg-card"
                                        style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Overview */}
                <div className="md:col-span-2 space-y-8">
                    {show.overview && (
                        <section>
                            <h2 className="font-display font-800 text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                                <span className="w-4 h-4 bg-[#0066FF] border-2 border-border inline-block" />
                                Overview
                            </h2>
                            <p className="text-muted-foreground leading-relaxed font-sans text-base border-l-4 border-[#0066FF] pl-5">
                                {show.overview}
                            </p>
                        </section>
                    )}

                    {/* Seasons list */}
                    {show.seasons?.length > 0 && (
                        <section>
                            <h2 className="font-display font-800 text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                                <span className="w-4 h-4 bg-[#FFE500] border-2 border-border inline-block" />
                                Seasons
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {show.seasons
                                    .filter((s: any) => s.season_number > 0)
                                    .map((season: any) => (
                                        <div
                                            key={season.id}
                                            className="border-3 border-border bg-card p-3"
                                            style={{ boxShadow: '4px 4px 0px 0px var(--border)' }}
                                        >
                                            <p className="font-display font-700 text-sm">Season {season.season_number}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {season.episode_count} episodes
                                            </p>
                                            {season.air_date && (
                                                <p className="text-xs text-muted-foreground">
                                                    {season.air_date.split('-')[0]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* Cast */}
                    {cast.length > 0 && (
                        <section>
                            <h2 className="font-display font-800 text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                                <span className="w-4 h-4 bg-[#E60000] border-2 border-border inline-block" />
                                Cast
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {cast.map((member: any) => (
                                    <Link
                                        key={member.id}
                                        href={`/people/${member.id}`}
                                        className="group block"
                                    >
                                        <div
                                            className="border-3 border-border bg-card group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200"
                                            style={{ boxShadow: '4px 4px 0px 0px var(--border)' }}
                                        >
                                            <div className="relative aspect-[2/3] w-full bg-muted border-b-3 border-border overflow-hidden">
                                                {member.profile_path ? (
                                                    <Image
                                                        src={getImageUrl(member.profile_path)}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover object-top"
                                                        sizes="100px"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Users size={20} className="text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <p className="font-display font-700 text-xs leading-tight line-clamp-1">{member.name}</p>
                                                <p className="text-muted-foreground text-[10px] line-clamp-1">{member.character}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Side info */}
                <aside className="space-y-6">
                    <div className="border-3 border-border bg-card p-5" style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                        <h3 className="font-display font-800 text-sm uppercase tracking-widest mb-4 border-b-2 border-border pb-2">Show Info</h3>
                        <dl className="space-y-3 text-sm">
                            {show.original_name && show.original_name !== show.name && (
                                <div>
                                    <dt className="font-display font-700 text-xs uppercase text-muted-foreground tracking-widest">Original Title</dt>
                                    <dd className="mt-0.5 font-600">{show.original_name}</dd>
                                </div>
                            )}
                            {show.original_language && (
                                <div>
                                    <dt className="font-display font-700 text-xs uppercase text-muted-foreground tracking-widest">Language</dt>
                                    <dd className="mt-0.5 font-600 uppercase">{show.original_language}</dd>
                                </div>
                            )}
                            {show.networks?.length > 0 && (
                                <div>
                                    <dt className="font-display font-700 text-xs uppercase text-muted-foreground tracking-widest">Network</dt>
                                    <dd className="mt-0.5 font-600">{show.networks.map((n: any) => n.name).join(', ')}</dd>
                                </div>
                            )}
                            {show.type && (
                                <div>
                                    <dt className="font-display font-700 text-xs uppercase text-muted-foreground tracking-widest">Type</dt>
                                    <dd className="mt-0.5 font-600">{show.type}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Created by */}
                    {show.created_by?.length > 0 && (
                        <div className="border-3 border-border bg-card p-5" style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                            <h3 className="font-display font-800 text-sm uppercase tracking-widest mb-3">Created By</h3>
                            {show.created_by.map((c: any) => (
                                <p key={c.id} className="font-600 text-sm">{c.name}</p>
                            ))}
                        </div>
                    )}
                </aside>
            </div>

            {/* Similar shows */}
            {similar.length > 0 && (
                <div className="border-t-3 border-border">
                    <TVScrollRow
                        title="You Might Also Like"
                        shows={similar}
                        accentColor="#0066FF"
                    />
                </div>
            )}
        </div>
    );
}
