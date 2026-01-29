'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
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
                console.log('[ReviewModal] User not logged in - saving to local IndexedDB');

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

                console.log('[ReviewModal] Review saved to local IndexedDB');
                setOpen(false);
                router.push('/reviews'); // Redirect to My Reviews
                router.refresh();
            } else {
                // CLOUD MODE: Save to API
                console.log('[ReviewModal] User logged in - saving to cloud API');

                const payload = {
                    movieKey: movie.id.toString(),
                    movieSource: 'tmdb' as const,
                    title: movie.title,
                    year: movie.release_date?.split('-')[0],
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : undefined,
                    genres: '[]', // JSON string as per schema
                    actors: '[]', // JSON string as per schema
                    ratingStars: rating, // number as per schema
                    verdict: verdict,
                    reviewText: reviewText || undefined,
                    isPublic: isPublic,
                };

                console.log('[ReviewModal] Sending payload:', payload);

                const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (!res.ok) {
                    // Show actual API error message
                    const errorMsg = data.message || 'Failed to create review';
                    console.error('[ReviewModal] API error:', data);

                    // If there are validation errors, show them
                    if (data.errors && Array.isArray(data.errors)) {
                        const validationErrors = data.errors
                            .map((err: any) => `${err.path.join('.')}: ${err.message}`)
                            .join(', ');
                        throw new Error(`${errorMsg} - ${validationErrors}`);
                    }

                    throw new Error(errorMsg);
                }

                console.log('[ReviewModal] Review saved to cloud:', data);
                setOpen(false);
                router.push('/reviews'); // Redirect to My Reviews
                router.refresh();
            }
        } catch (error) {
            console.error('[ReviewModal] Error:', error);
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
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review {movie.title}</DialogTitle>
                    <DialogDescription>
                        {status === 'authenticated'
                            ? 'Your review will be saved to the cloud'
                            : 'Your review will be saved locally (log in to sync to cloud)'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-400'
                                    }`}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="verdict">Verdict</Label>
                        <Select onValueChange={setVerdict}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verdict" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEVER_WATCH">🚫 Never Watch</SelectItem>
                                <SelectItem value="WATCH">👍 Watch</SelectItem>
                                <SelectItem value="RECOMMEND">⭐ Recommend</SelectItem>
                                <SelectItem value="STRONGLY_RECOMMEND">🌟 Strongly Recommend</SelectItem>
                                <SelectItem value="BEST_EVER">🏆 Best Ever</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="review">Review (Optional)</Label>
                        <Textarea
                            id="review"
                            placeholder="What did you like or dislike?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Public checkbox - only show for logged-in users */}
                    {status === 'authenticated' && (
                        <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-md border border-zinc-800">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <div className="flex-1">
                                <Label htmlFor="isPublic" className="cursor-pointer font-medium">
                                    Make this review public
                                </Label>
                                <p className="text-xs text-gray-400 mt-1">
                                    Public reviews appear on the home page and can be seen by everyone
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={loading || rating === 0 || !verdict}>
                        {loading ? 'Saving...' : 'Save Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

