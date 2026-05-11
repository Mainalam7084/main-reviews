'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

interface TVShow {
    id: number;
    name: string;
    poster_path: string | null;
    first_air_date: string;
}

export function TVReviewModal({ show }: { show: TVShow }) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [verdict, setVerdict] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    const tvKey = `tv_${show.id}`;

    const handleSubmit = async () => {
        if (rating === 0 || !verdict) {
            setError('Please provide a rating and verdict');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const isLoggedIn = status === 'authenticated' && !!session?.user;
            const posterUrl = show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : undefined;

            if (!isLoggedIn) {
                await db.reviews.add({
                    movieKey: tvKey,
                    movieSource: 'tmdb',
                    title: show.name,
                    year: show.first_air_date?.split('-')[0],
                    poster: posterUrl,
                    genres: [],
                    actors: [],
                    ratingStars: rating,
                    verdict: verdict as Verdict,
                    reviewText: reviewText || undefined,
                    isPublic: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                setOpen(false);
                router.push('/reviews');
                router.refresh();
            } else {
                const payload = {
                    movieKey: tvKey,
                    movieSource: 'tmdb' as const,
                    title: show.name,
                    year: show.first_air_date?.split('-')[0],
                    poster: posterUrl,
                    genres: '[]',
                    actors: '[]',
                    ratingStars: rating,
                    verdict: verdict,
                    reviewText: reviewText || undefined,
                    isPublic: true,
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
                router.push('/reviews');
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
                    <DialogTitle className="font-display font-800 text-2xl uppercase tracking-tighter">Review {show.name}</DialogTitle>
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
