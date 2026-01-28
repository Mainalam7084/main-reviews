import { z } from 'zod';

const OMDB_BASE_URL = 'http://www.omdbapi.com/';

// Zod schemas for OMDb responses
const OMDBMovieSchema = z.object({
    Title: z.string(),
    Year: z.string(),
    Rated: z.string().optional(),
    Released: z.string().optional(),
    Runtime: z.string().optional(),
    Genre: z.string().optional(),
    Director: z.string().optional(),
    Writer: z.string().optional(),
    Actors: z.string().optional(),
    Plot: z.string().optional(),
    Language: z.string().optional(),
    Country: z.string().optional(),
    Awards: z.string().optional(),
    Poster: z.string().optional(),
    Ratings: z.array(z.object({
        Source: z.string(),
        Value: z.string(),
    })).optional(),
    Metascore: z.string().optional(),
    imdbRating: z.string().optional(),
    imdbVotes: z.string().optional(),
    imdbID: z.string(),
    Type: z.string(),
    DVD: z.string().optional(),
    BoxOffice: z.string().optional(),
    Production: z.string().optional(),
    Website: z.string().optional(),
    Response: z.literal('True'),
});

const OMDBSearchResultSchema = z.object({
    Title: z.string(),
    Year: z.string(),
    imdbID: z.string(),
    Type: z.string(),
    Poster: z.string().optional(),
});

const OMDBSearchResponseSchema = z.object({
    Search: z.array(OMDBSearchResultSchema),
    totalResults: z.string(),
    Response: z.literal('True'),
});

const OMDBErrorSchema = z.object({
    Response: z.literal('False'),
    Error: z.string(),
});

export type OMDBMovie = z.infer<typeof OMDBMovieSchema>;
export type OMDBSearchResult = z.infer<typeof OMDBSearchResultSchema>;
export type OMDBSearchResponse = z.infer<typeof OMDBSearchResponseSchema>;

class OMDBClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async fetch<T>(params: Record<string, string>): Promise<T> {
        const url = new URL(OMDB_BASE_URL);
        url.searchParams.append('apikey', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`OMDb API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response is an error
        const errorCheck = OMDBErrorSchema.safeParse(data);
        if (errorCheck.success) {
            throw new Error(`OMDb API error: ${errorCheck.data.Error}`);
        }

        return data;
    }

    async searchMovies(query: string, page: number = 1): Promise<OMDBSearchResponse> {
        const data = await this.fetch<OMDBSearchResponse>({
            s: query,
            type: 'movie',
            page: page.toString(),
        });
        return OMDBSearchResponseSchema.parse(data);
    }

    async getMovieById(imdbId: string): Promise<OMDBMovie> {
        const data = await this.fetch<OMDBMovie>({
            i: imdbId,
            plot: 'full',
        });
        return OMDBMovieSchema.parse(data);
    }

    async getMovieByTitle(title: string, year?: string): Promise<OMDBMovie> {
        const params: Record<string, string> = {
            t: title,
            plot: 'full',
        };

        if (year) {
            params.y = year;
        }

        const data = await this.fetch<OMDBMovie>(params);
        return OMDBMovieSchema.parse(data);
    }
}

export const createOMDBClient = (apiKey?: string) => {
    const key = apiKey || process.env.OMDB_API_KEY;
    if (!key) {
        throw new Error('OMDb API key is required');
    }
    return new OMDBClient(key);
};
