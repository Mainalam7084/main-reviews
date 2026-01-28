import { NextRequest, NextResponse } from 'next/server';
import { createTMDBClient } from '@/lib/api/tmdb-client';
import { createOMDBClient } from '@/lib/api/omdb-client';
import { tmdbDetailsToMovieDetails, omdbToMovieDetails, type MovieDetails } from '@/lib/api/movie-types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const source = searchParams.get('source') as 'tmdb' | 'omdb' || 'tmdb';

        let movieDetails: MovieDetails;

        if (source === 'tmdb') {
            const tmdbClient = createTMDBClient();
            const movie = await tmdbClient.getMovieDetails(parseInt(id));
            const posterUrl = tmdbClient.getPosterUrl(movie.poster_path) || undefined;
            const backdropUrl = tmdbClient.getBackdropUrl(movie.backdrop_path) || undefined;
            movieDetails = tmdbDetailsToMovieDetails(movie, posterUrl, backdropUrl);
        } else {
            const omdbClient = createOMDBClient();
            const movie = await omdbClient.getMovieById(id);
            movieDetails = omdbToMovieDetails(movie);
        }

        return NextResponse.json(movieDetails);
    } catch (error) {
        console.error('Movie details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movie details' },
            { status: 500 }
        );
    }
}
