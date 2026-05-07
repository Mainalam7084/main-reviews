import { getCollection, getImageUrl, getBackdropUrl, POPULAR_COLLECTIONS } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MovieCard } from '@/components/ui/movie-card';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ArrowLeft, Bookmark, Film } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return POPULAR_COLLECTIONS.map((c) => ({ id: String(c.id) }));
}

export default async function CollectionPage({ params }: PageProps) {
    const { id } = await params;
    const collection = await getCollection(Number(id));

    if (!collection) notFound();

    const backdropUrl = getBackdropUrl(collection.backdrop_path, 'w1280');
    const posterUrl = collection.poster_path ? getImageUrl(collection.poster_path) : null;

    const movies = (collection.parts ?? []).sort((a: any, b: any) => {
        const dateA = a.release_date ?? '';
        const dateB = b.release_date ?? '';
        return dateA.localeCompare(dateB);
    });

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Hero */}
            <div className="relative w-full" style={{ minHeight: '55vh' }}>
                {backdropUrl && (
                    <Image
                        src={backdropUrl}
                        alt={collection.name}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-end px-4 md:px-8 pb-10 pt-24">
                    {posterUrl && (
                        <div
                            className="hidden md:block shrink-0 w-48 border-4 border-border"
                            style={{ boxShadow: '8px 8px 0px 0px var(--border)' }}
                        >
                            <Image
                                src={posterUrl}
                                alt={collection.name}
                                width={192}
                                height={288}
                                className="block w-full"
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        <Link href="/movies" className="inline-flex mb-4">
                            <BrutalButton variant="ghost" size="sm" className="text-xs bg-background/80">
                                <ArrowLeft size={14} /> Back to Movies
                            </BrutalButton>
                        </Link>

                        <div className="inline-flex items-center gap-1.5 bg-[#FFE500] text-[#0A0A0A] px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest mb-3 ml-2"
                            style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                            <Bookmark size={11} /> Collection
                        </div>

                        <h1 className="text-4xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground leading-none"
                            style={{ textShadow: '4px 4px 0px #FFE500' }}>
                            {collection.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5 bg-card border-2 border-border px-3 py-1 font-display font-700 text-sm"
                                style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                                <Film size={14} />
                                {movies.length} {movies.length === 1 ? 'film' : 'films'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview */}
            {collection.overview && (
                <div className="px-4 md:px-8 py-8 border-b-3 border-border bg-background">
                    <div className="max-w-3xl">
                        <p className="text-muted-foreground leading-relaxed font-sans text-lg border-l-4 border-[#FFE500] pl-5">
                            {collection.overview}
                        </p>
                    </div>
                </div>
            )}

            {/* Films in collection */}
            <div className="px-4 md:px-8 py-12 bg-background">
                <div className="mb-8">
                    <h2 className="font-display font-800 text-2xl md:text-4xl uppercase tracking-tight text-foreground"
                        style={{ textShadow: '3px 3px 0px #FFE500' }}>
                        Films in This Collection
                    </h2>
                    <div className="h-1 w-16 mt-2 bg-foreground" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie: any) => (
                        <div key={movie.id} className="relative">
                            {/* Order badge */}
                            <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-[#FFE500] border-2 border-border flex items-center justify-center font-display font-800 text-xs text-[#0A0A0A]"
                                style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}>
                                {movies.indexOf(movie) + 1}
                            </div>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
