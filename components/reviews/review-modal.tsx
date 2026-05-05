'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { BrutalButton } from '@/components/ui/brutal-button';
import { RatingStars } from '@/components/ui/rating-stars';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { db, type Verdict } from '@/lib/db/local-db';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
}

export function ReviewModal({ movie }: { movie: Movie }) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [verdict, setVerdict] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleSubmit = async () => {
        if (rating === 0 || !verdict) {
            setError('Please provide a rating and verdict');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const isLoggedIn = status === 'authenticated' && !!session?.user;

            if (!isLoggedIn) {
                // LOCAL MODE: Save to IndexedDB via Dexie
                await db.reviews.add({
                    movieKey: movie.id.toString(),
                    movieSource: 'tmdb',
                    title: movie.title,
                    year: movie.release_date?.split('-')[0],
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : undefined,
                    genres: [],
                    actors: [],
                    ratingStars: rating,
                    verdict: verdict as Verdict,
                    reviewText: reviewText || undefined,
                    isPublic: isPublic,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                setOpen(false);
                router.push('/reviews'); // Redirect to My Reviews
                router.refresh();
            } else {
                // CLOUD MODE: Save to API
                const payload = {
                    movieKey: movie.id.toString(),
                    movieSource: 'tmdb' as const,
                    title: movie.title,
                    year: movie.release_date?.split('-')[0],
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : undefined,
                    genres: '[]',
                    actors: '[]',
                    ratingStars: rating,
                    verdict: verdict,
                    reviewText: reviewText || undefined,
                    isPublic: isPublic,
                };

                const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (!res.ok) {
                    const errorMsg = data.message || 'Failed to create review';
                    if (data.errors && Array.isArray(data.errors)) {
                        const validationErrors = data.errors
                            .map((err: any) => `${err.path.join('.')}: ${err.message}`)
                            .join(', ');
                        throw new Error(`${errorMsg} - ${validationErrors}`);
                    }
                    throw new Error(errorMsg);
                }

                setOpen(false);
                router.push('/reviews'); // Redirect to My Reviews
                router.refresh();
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <BrutalButton variant="primary" size="xl">
                    Drop a Review
                </BrutalButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-3 border-border shadow-[8px_8px_0px_0px_var(--border)] rounded-none bg-card">
                <DialogHeader>
                    <DialogTitle className="font-display font-800 text-2xl uppercase tracking-tighter">Review {movie.title}</DialogTitle>
                    <DialogDescription className="font-sans text-sm font-500">
                        {status === 'authenticated'
                            ? 'Your hot take is going straight to the cloud.'
                            : 'Your take will be saved locally (log in to sync).'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {error && (
                        <div className="bg-[#E60000] border-2 border-border text-white px-4 py-3 font-display font-700 shadow-[3px_3px_0px_0px_var(--border)]">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-3 bg-muted border-3 border-border p-4 shadow-[4px_4px_0px_0px_var(--border)]">
                        <Label className="font-display font-700 uppercase tracking-widest text-xs">Rating</Label>
                        <RatingStars value={rating} onChange={setRating} size="lg" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="verdict" className="font-display font-700 uppercase tracking-wide text-sm">The Verdict</Label>
                        <Select onValueChange={setVerdict}>
                            <SelectTrigger className="brutal-input rounded-none h-12 shadow-[3px_3px_0px_0px_var(--border)] font-display font-600">
                                <SelectValue placeholder="What's the final word?" />
                            </SelectTrigger>
                            <SelectContent className="border-3 border-border rounded-none shadow-[6px_6px_0px_0px_var(--border)] bg-card">
                                <SelectItem value="BEST_EVER" className="font-display font-600 focus:bg-[#FFE500] focus:text-[#0A0A0A]">Best Ever</SelectItem>
                                <SelectItem value="STRONGLY_RECOMMEND" className="font-display font-600 focus:bg-[#E60000] focus:text-[#FFFFFF]">Strongly Recommend</SelectItem>
                                <SelectItem value="RECOMMEND" className="font-display font-600 focus:bg-[#00F5A0] focus:text-[#0A0A0A]">Recommend</SelectItem>
                                <SelectItem value="WATCH" className="font-display font-600 focus:bg-[#0066FF] focus:text-[#FFFFFF]">Watch</SelectItem>
                                <SelectItem value="NEVER_WATCH" className="font-display font-600 focus:bg-[#FF0000] focus:text-[#FFFFFF]">Never Watch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="review" className="font-display font-700 uppercase tracking-wide text-sm">Your Thoughts (Optional)</Label>
                        <textarea
                            id="review"
                            placeholder="Spill the tea..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="brutal-input min-h-[120px] p-3 resize-y font-sans shadow-[3px_3px_0px_0px_var(--border)]"
                        />
                    </div>

                    {status === 'authenticated' && (
                        <div className="flex items-start gap-3 p-4 bg-[#FFE500] border-3 border-border shadow-[4px_4px_0px_0px_var(--border)]">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="mt-1 h-5 w-5 border-2 border-border text-[#E60000] focus:ring-0 focus:ring-offset-0 rounded-none bg-white cursor-pointer"
                            />
                            <div className="flex-1">
                                <Label htmlFor="isPublic" className="cursor-pointer font-display font-800 text-[#0A0A0A] uppercase tracking-tight text-base">
                                    Make it public
                                </Label>
                                <p className="text-xs font-600 text-[#0A0A0A]/70 mt-1 leading-tight">
                                    Let everyone see your brilliant opinion on the home page.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <BrutalButton
                        onClick={handleSubmit}
                        disabled={loading || rating === 0 || !verdict}
                        variant="primary"
                        className="w-full sm:w-auto"
                    >
                        {loading ? 'Dropping...' : 'Drop Review'}
                    </BrutalButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
