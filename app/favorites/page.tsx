'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrutalButton } from '@/components/ui/brutal-button';

const LS_KEY = 'mainreviews_favorites';

interface FavoriteItem {
    movieId: string;
    movieTitle: string;
    poster?: string;
    createdAt: string;
}

function getLocalFavorites(): FavoriteItem[] {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function FavoriteCard({ item, onRemove }: { item: FavoriteItem; onRemove: (id: string) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="group relative bg-card border-3 border-border hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
            style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
        >
            <Link href={`/movies/${item.movieId}`} className="block">
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted border-b-3 border-border">
                    {item.poster ? (
                        <Image
                            src={item.poster}
                            alt={item.movieTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="font-display font-700 text-muted-foreground uppercase text-xs tracking-widest text-center px-2">
                                No Poster
                            </span>
                        </div>
                    )}
                    {/* Heart badge */}
                    <div className="absolute top-2 left-2 bg-[#E60000] text-white border-2 border-white p-1"
                         style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                        <Heart className="w-3 h-3 fill-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="p-3">
                    <h3 className="font-display font-700 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {item.movieTitle}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </Link>

            {/* Remove button */}
            <button
                onClick={(e) => { e.preventDefault(); onRemove(item.movieId); }}
                className="absolute top-2 right-2 w-7 h-7 bg-white border-2 border-[#0A0A0A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E60000] hover:text-white"
                style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}
                aria-label="Remove from favorites"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        const load = async () => {
            setLoading(true);
            if (session?.user) {
                try {
                    const res = await fetch('/api/favorites');
                    if (res.ok) {
                        const { favorites: data } = await res.json();
                        setFavorites(
                            data.map((f: any) => ({
                                movieId: f.movieId,
                                movieTitle: f.movieTitle,
                                poster: f.poster ?? undefined,
                                createdAt: f.createdAt,
                            }))
                        );
                    }
                } catch {
                    // ignore
                }
            } else {
                setFavorites(getLocalFavorites());
            }
            setLoading(false);
        };

        load();
    }, [session, status]);

    const remove = async (movieId: string) => {
        if (session?.user) {
            await fetch(`/api/favorites/${movieId}`, { method: 'DELETE' });
        } else {
            const current: FavoriteItem[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
            localStorage.setItem(LS_KEY, JSON.stringify(current.filter((f) => f.movieId !== movieId)));
        }
        setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Header */}
            <div className="border-b-3 border-border bg-background py-10 md:py-14 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-2 inline-flex items-center gap-2 bg-[#E60000] text-white px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest"
                         style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        My List
                    </div>
                    <h1 className="font-display font-800 text-4xl md:text-6xl uppercase tracking-tight text-foreground mt-3"
                        style={{ textShadow: '4px 4px 0px var(--primary)' }}>
                        Favorites
                    </h1>
                    <div className="h-1.5 w-28 bg-foreground mt-3" />
                    {!loading && favorites.length > 0 && (
                        <p className="mt-3 text-muted-foreground font-sans text-sm">
                            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
                            {!session?.user && ' · stored locally on this device'}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="border-3 border-border bg-card animate-pulse">
                                <div className="aspect-[2/3] bg-muted border-b-3 border-border" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-muted w-3/4" />
                                    <div className="h-3 bg-muted w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="border-3 border-border bg-card p-16 text-center"
                         style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="font-display font-700 text-2xl text-muted-foreground uppercase">
                            No favorites yet
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Hit the heart icon on any movie card to save it here.
                        </p>
                        <div className="mt-6">
                            <Link href="/movies">
                                <BrutalButton variant="primary" size="lg">Browse Movies</BrutalButton>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {favorites.map((item) => (
                                <FavoriteCard key={item.movieId} item={item} onRemove={remove} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Sign-in nudge for guests with favorites */}
                {!session?.user && favorites.length > 0 && (
                    <div className="mt-12 border-3 border-border bg-[#FFE500] p-8 text-center"
                         style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}>
                        <h3 className="font-display font-800 text-2xl uppercase text-[#0A0A0A]">
                            Save your list forever
                        </h3>
                        <p className="mt-2 text-[#0A0A0A]/70 text-sm font-sans">
                            Your favorites are stored locally. Sign in to sync them across devices.
                        </p>
                        <div className="mt-5 flex justify-center gap-3">
                            <Link href="/auth/login">
                                <BrutalButton variant="dark" size="lg">Sign In</BrutalButton>
                            </Link>
                            <Link href="/auth/register">
                                <BrutalButton variant="ghost" size="lg">Create Account</BrutalButton>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
