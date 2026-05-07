'use client';

import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

// ─── Local storage helpers ────────────────────────────────────────────────────

const LS_KEY = 'mainreviews_favorites';

interface StoredFavorite {
    movieId: string;
    movieTitle: string;
    poster?: string;
    createdAt: string;
}

function getLocalFavorites(): StoredFavorite[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); }
    catch { return []; }
}

function setLocalFavorites(favs: StoredFavorite[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(favs));
}

// ─── Shared favorites context (avoids N API calls for N cards) ────────────────

interface FavoritesCtx {
    ids: Set<string>;
    add: (id: string) => void;
    remove: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesCtx>({
    ids: new Set(),
    add: () => {},
    remove: () => {},
});

/** Wrap a layout or page section to share one fetch across many FavoriteButtons. */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [ids, setIds] = useState<Set<string>>(new Set());
    const fetched = useRef(false);

    useEffect(() => {
        if (status === 'loading' || fetched.current) return;
        fetched.current = true;

        if (session?.user) {
            fetch('/api/favorites')
                .then((r) => r.ok ? r.json() : { favorites: [] })
                .then(({ favorites }) => {
                    setIds(new Set((favorites as any[]).map((f) => f.movieId)));
                })
                .catch(() => {});
        } else {
            setIds(new Set(getLocalFavorites().map((f) => f.movieId)));
        }
    }, [session, status]);

    const add = useCallback((id: string) => setIds((prev) => new Set([...prev, id])), []);
    const remove = useCallback((id: string) => setIds((prev) => { const next = new Set(prev); next.delete(id); return next; }), []);

    return (
        <FavoritesContext.Provider value={{ ids, add, remove }}>
            {children}
        </FavoritesContext.Provider>
    );
}

// ─── FavoriteButton ───────────────────────────────────────────────────────────

interface FavoriteButtonProps {
    movieId: number;
    movieTitle: string;
    poster?: string | null;
    /** 'icon' = small heart overlay on cards, 'button' = full labeled button on detail page */
    variant?: 'icon' | 'button';
    className?: string;
}

export function FavoriteButton({
    movieId,
    movieTitle,
    poster,
    variant = 'icon',
    className,
}: FavoriteButtonProps) {
    const { data: session } = useSession();
    const { ids, add, remove } = useContext(FavoritesContext);
    const [loading, setLoading] = useState(false);

    const movieIdStr = String(movieId);
    const favorited = ids.has(movieIdStr);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setLoading(true);

        try {
            if (session?.user) {
                if (favorited) {
                    await fetch(`/api/favorites/${movieIdStr}`, { method: 'DELETE' });
                    remove(movieIdStr);
                } else {
                    await fetch('/api/favorites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ movieId: movieIdStr, movieTitle, poster }),
                    });
                    add(movieIdStr);
                }
            } else {
                const favs = getLocalFavorites();
                if (favorited) {
                    setLocalFavorites(favs.filter((f) => f.movieId !== movieIdStr));
                    remove(movieIdStr);
                } else {
                    setLocalFavorites([
                        ...favs,
                        { movieId: movieIdStr, movieTitle, poster: poster ?? undefined, createdAt: new Date().toISOString() },
                    ]);
                    add(movieIdStr);
                }
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'button') {
        return (
            <button
                onClick={toggle}
                disabled={loading}
                className={cn(
                    'flex items-center gap-2 px-5 py-2.5 border-3 border-border font-display font-700 uppercase tracking-wide text-sm transition-all',
                    favorited
                        ? 'bg-[#E60000] text-white hover:bg-[#c50000]'
                        : 'bg-card text-foreground hover:bg-[#FFE500]',
                    loading && 'opacity-60 cursor-not-allowed',
                    className
                )}
                style={{ boxShadow: '4px 4px 0px 0px var(--border)' }}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Heart className={cn('w-4 h-4', favorited && 'fill-white')} />
                {favorited ? 'Favorited' : 'Favorite'}
            </button>
        );
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={cn(
                'w-7 h-7 flex items-center justify-center border-2 border-border transition-all',
                favorited
                    ? 'bg-[#E60000] text-white'
                    : 'bg-white/90 text-[#0A0A0A] hover:bg-[#FFE500]',
                loading && 'opacity-60',
                className
            )}
            style={{ boxShadow: '2px 2px 0px 0px var(--border)' }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart className={cn('w-3.5 h-3.5', favorited && 'fill-white')} />
        </button>
    );
}
