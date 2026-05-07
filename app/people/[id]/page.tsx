import { getPersonDetails, getPersonMovieCredits, getImageUrl, type Movie } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Film, ArrowLeft } from 'lucide-react';
import { BrutalButton } from '@/components/ui/brutal-button';
import { MovieCard } from '@/components/ui/movie-card';
import { ScrollRow } from '@/components/ui/scroll-row';
import { notFound } from 'next/navigation';

export default async function PersonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let person;
    let credits;
    try {
        [person, credits] = await Promise.all([
            getPersonDetails(id),
            getPersonMovieCredits(id),
        ]);
    } catch {
        notFound();
    }

    const castMovies: Movie[] = (credits.cast ?? [])
        .filter((m: any) => m.poster_path)
        .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 30);

    const crewMovies: Movie[] = (credits.crew ?? [])
        .filter((m: any) => m.poster_path && m.job === 'Director')
        .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 20);

    const knownFor = castMovies.slice(0, 6);

    const age = person.birthday
        ? Math.floor((new Date().getTime() - new Date(person.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : null;

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Back link */}
            <div className="px-4 md:px-8 pt-6">
                <Link href="/people">
                    <BrutalButton variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
                        <ArrowLeft className="w-3.5 h-3.5" /> All People
                    </BrutalButton>
                </Link>
            </div>

            {/* Hero */}
            <div className="px-4 md:px-8 py-10 border-b-3 border-border bg-background">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                    {/* Photo */}
                    <div className="shrink-0">
                        <div
                            className="w-48 md:w-64 border-3 border-border"
                            style={{ boxShadow: '8px 8px 0px 0px var(--primary)' }}
                        >
                            {person.profile_path ? (
                                <Image
                                    src={getImageUrl(person.profile_path, 'w500')}
                                    alt={person.name}
                                    width={256}
                                    height={384}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] flex items-center justify-center bg-muted">
                                    <span className="font-display font-800 text-5xl text-muted-foreground uppercase">
                                        {person.name[0]}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-block bg-[#E60000] text-white px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest mb-3"
                                 style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}>
                                {person.known_for_department}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-800 tracking-tighter uppercase text-foreground"
                                style={{ textShadow: '3px 3px 0px var(--primary)' }}>
                                {person.name}
                            </h1>
                            <div className="h-1.5 w-20 bg-foreground mt-3" />
                        </div>

                        {/* Meta badges */}
                        <div className="flex flex-wrap gap-3">
                            {person.birthday && (
                                <div className="flex items-center gap-2 bg-card border-3 border-border px-3 py-2"
                                     style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                                    <div>
                                        <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground">Born</p>
                                        <p className="font-display font-700 text-sm">
                                            {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            {age && !person.deathday ? ` (age ${age})` : ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div className="flex items-center gap-2 bg-card border-3 border-border px-3 py-2"
                                     style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                    <div>
                                        <p className="font-display font-700 text-xs uppercase tracking-widest text-muted-foreground">From</p>
                                        <p className="font-display font-700 text-sm">{person.place_of_birth}</p>
                                    </div>
                                </div>
                            )}
                            {castMovies.length > 0 && (
                                <div className="flex items-center gap-2 bg-[#FFE500] text-[#0A0A0A] border-3 border-border px-3 py-2"
                                     style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                                    <Film className="w-4 h-4 shrink-0" />
                                    <div>
                                        <p className="font-display font-700 text-xs uppercase tracking-widest opacity-70">Credits</p>
                                        <p className="font-display font-700 text-sm">{(credits.cast?.length ?? 0) + (credits.crew?.length ?? 0)} films</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Biography */}
                        {person.biography && (
                            <div className="border-l-4 border-[#E60000] pl-5">
                                <p className="text-muted-foreground font-sans text-base leading-relaxed line-clamp-6">
                                    {person.biography}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Known For */}
            {knownFor.length > 0 && (
                <div className="px-4 md:px-8 py-10 border-b-3 border-border">
                    <div className="mb-6">
                        <h2 className="font-display font-800 text-2xl md:text-3xl uppercase tracking-tight"
                            style={{ textShadow: '3px 3px 0px var(--secondary)' }}>
                            Known For
                        </h2>
                        <div className="h-1 w-16 bg-foreground mt-2" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {knownFor.map((movie: Movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            )}

            {/* Filmography */}
            {castMovies.length > 0 && (
                <section className="py-2">
                    <ScrollRow
                        title="Filmography"
                        movies={castMovies}
                        accentColor="#E60000"
                    />
                </section>
            )}

            {/* Directed */}
            {crewMovies.length > 0 && (
                <section className="py-2">
                    <ScrollRow
                        title="Directed"
                        movies={crewMovies}
                        accentColor="#0066FF"
                    />
                </section>
            )}
        </div>
    );
}
