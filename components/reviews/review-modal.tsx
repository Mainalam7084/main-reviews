'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (rating === 0 || !verdict) return;

        setLoading(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movieId: movie.id.toString(),
                    movieTitle: movie.title,
                    moviePoster: movie.poster_path,
                    movieYear: movie.release_date?.split('-')[0],
                    rating,
                    verdict,
                    text: reviewText,
                }),
            });

            if (!res.ok) throw new Error('Failed to create review');

            setOpen(false);
            router.push('/reviews'); // Redirect to My Reviews
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
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
                        What did you think of this movie?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
