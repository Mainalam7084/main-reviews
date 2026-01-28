import { z } from 'zod';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Zod schemas for TMDB responses
const TMDBMovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    original_title: z.string().optional(),
    overview: z.string().optional(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
    release_date: z.string().optional(),
    genre_ids: z.array(z.number()).optional(),
    vote_average: z.number().optional(),
    vote_count: z.number().optional(),
    popularity: z.number().optional(),
});

const TMDBMovieDetailsSchema = TMDBMovieSchema.extend({
    genres: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })).optional(),
    runtime: z.number().nullable(),
    credits: z.object({
        cast: z.array(z.object({
            id: z.number(),
            name: z.string(),
            character: z.string().optional(),
            profile_path: z.string().nullable(),
        })).optional(),
        crew: z.array(z.object({
            id: z.number(),
            name: z.string(),
            job: z.string(),
            department: z.string(),
        })).optional(),
    }).optional(),
});

const TMDBSearchResponseSchema = z.object({
    page: z.number(),
    results: z.array(TMDBMovieSchema),
    total_pages: z.number(),
    total_results: z.number(),
});

export type TMDBMovie = z.infer<typeof TMDBMovieSchema>;
export type TMDBMovieDetails = z.infer<typeof TMDBMovieDetailsSchema>;
export type TMDBSearchResponse = z.infer<typeof TMDBSearchResponseSchema>;

class TMDBClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
        const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
        const data = await this.fetch<TMDBSearchResponse>('/search/movie', {
            query,
            page: page.toString(),
            include_adult: 'false',
        });
        return TMDBSearchResponseSchema.parse(data);
    }

    async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
        const data = await this.fetch<TMDBMovieDetails>(`/movie/${movieId}`, {
            append_to_response: 'credits',
        });
        return TMDBMovieDetailsSchema.parse(data);
    }

    async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse> {
        const data = await this.fetch<TMDBSearchResponse>(`/trending/movie/${timeWindow}`);
        return TMDBSearchResponseSchema.parse(data);
    }

    async getTopRated(page: number = 1): Promise<TMDBSearchResponse> {
        const data = await this.fetch<TMDBSearchResponse>('/movie/top_rated', {
            page: page.toString(),
        });
        return TMDBSearchResponseSchema.parse(data);
    }

    async getUpcoming(page: number = 1): Promise<TMDBSearchResponse> {
        const data = await this.fetch<TMDBSearchResponse>('/movie/upcoming', {
            page: page.toString(),
        });
        return TMDBSearchResponseSchema.parse(data);
    }

    getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE}/${size}${path}`;
    }

    getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE}/${size}${path}`;
    }
}

export const createTMDBClient = (apiKey?: string) => {
    const key = apiKey || process.env.TMDB_API_KEY;
    if (!key) {
        throw new Error('TMDB API key is required');
    }
    return new TMDBClient(key);
};
