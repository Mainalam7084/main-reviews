import type { TMDBMovie, TMDBMovieDetails } from './tmdb-client';
import type { OMDBMovie, OMDBSearchResult } from './omdb-client';

export interface MovieResult {
    id: string;
    source: 'tmdb' | 'omdb';
    title: string;
    year?: string;
    poster?: string;
    overview?: string;
    rating?: number;
}

export interface MovieDetails {
    id: string;
    source: 'tmdb' | 'omdb';
    title: string;
    year?: string;
    poster?: string;
    backdrop?: string;
    genres: string[];
    runtime?: string;
    director?: string;
    actors: string[];
    overview?: string;
    rating?: number;
}

export function tmdbToMovieResult(movie: TMDBMovie): MovieResult {
    return {
        id: movie.id.toString(),
        source: 'tmdb',
        title: movie.title,
        year: movie.release_date?.split('-')[0],
        poster: movie.poster_path || undefined,
        overview: movie.overview,
        rating: movie.vote_average,
    };
}

export function omdbSearchToMovieResult(movie: OMDBSearchResult): MovieResult {
    return {
        id: movie.imdbID,
        source: 'omdb',
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster !== 'N/A' ? movie.Poster : undefined,
        overview: undefined,
        rating: undefined,
    };
}

export function tmdbDetailsToMovieDetails(movie: TMDBMovieDetails, posterUrl?: string, backdropUrl?: string): MovieDetails {
    const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;
    const actors = movie.credits?.cast?.slice(0, 10).map(c => c.name) || [];

    return {
        id: movie.id.toString(),
        source: 'tmdb',
        title: movie.title,
        year: movie.release_date?.split('-')[0],
        poster: posterUrl,
        backdrop: backdropUrl,
        genres: movie.genres?.map(g => g.name) || [],
        runtime: movie.runtime ? `${movie.runtime} min` : undefined,
        director,
        actors,
        overview: movie.overview,
        rating: movie.vote_average,
    };
}

export function omdbToMovieDetails(movie: OMDBMovie): MovieDetails {
    return {
        id: movie.imdbID,
        source: 'omdb',
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster !== 'N/A' ? movie.Poster : undefined,
        backdrop: undefined,
        genres: movie.Genre?.split(', ') || [],
        runtime: movie.Runtime !== 'N/A' ? movie.Runtime : undefined,
        director: movie.Director !== 'N/A' ? movie.Director : undefined,
        actors: movie.Actors?.split(', ') || [],
        overview: movie.Plot !== 'N/A' ? movie.Plot : undefined,
        rating: movie.imdbRating ? parseFloat(movie.imdbRating) : undefined,
    };
}
