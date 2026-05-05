import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getImageUrl, type Movie } from '@/lib/tmdb';
import { BrutalCardStatic } from './brutal-card';

interface MovieCardProps {
    movie: Movie;
    priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
    return (
        <Link href={`/movies/${movie.id}`} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <BrutalCardStatic className="h-full flex flex-col group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted border-b-3 border-border">
                    {movie.poster_path ? (
                        <Image
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={priority}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center">
                            <span className="font-display font-700 text-muted-foreground uppercase text-sm tracking-widest break-words w-full">No Poster</span>
                        </div>
                    )}
                    
                    {/* Rating badge overlay */}
                    {movie.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] px-2 py-0.5 flex items-center gap-1 font-display font-700 text-xs shadow-[2px_2px_0px_0px_#0A0A0A]">
                            <Star className="w-3 h-3 fill-[#0A0A0A]" />
                            {(movie.vote_average || 0).toFixed(1)}
                        </div>
                    )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between bg-card">
                    <h3 className="font-display font-700 text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h3>
                    <div className="mt-2 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                        {movie.release_date?.split('-')[0] || 'TBA'}
                    </div>
                </div>
            </BrutalCardStatic>
        </Link>
    );
}
