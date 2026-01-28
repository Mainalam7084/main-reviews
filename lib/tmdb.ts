import { env } from './env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    overview: string;
    vote_average: number;
}

export interface TmdbSearchResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export const getImageUrl = (path: string | null) => {
    if (!path) return '/placeholder-movie.jpg'; // You might want to add a placeholder image
    return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${env.TMDB_API_KEY}&query=${encodeURIComponent(
            query
        )}`
    );
    if (!res.ok) throw new Error('Failed to fetch movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${env.TMDB_API_KEY}`
    );
    if (!res.ok) throw new Error('Failed to fetch trending movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${env.TMDB_API_KEY}&page=1`
    );
    if (!res.ok) throw new Error('Failed to fetch top rated movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${env.TMDB_API_KEY}&page=1`
    );
    if (!res.ok) throw new Error('Failed to fetch upcoming movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMoviesByCountry = async (countryCode: string): Promise<Movie[]> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc`
    );
    if (!res.ok) throw new Error('Failed to fetch movies by country');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};


export const searchMoviesWithFilter = async (query: string, language?: string): Promise<Movie[]> => {
    if (!query) return [];

    // If language is specified, we fetch more results and filter client-side 
    // because TMDB search API doesn't support filtering by 'original_language' directly in the query param in a strict way.
    // However, for strict filtering, we rely on post-filtering.

    const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
    );

    if (!res.ok) throw new Error('Failed to search movies');
    const data: TmdbSearchResponse = await res.json();

    let results = data.results;

    if (language) {
        // Filter by original language if specified
        results = results.filter(movie => (movie as any).original_language === language);
    }

    return results;
};

// Helper for category definitions
export const CATEGORIES = {
    'trending': { title: 'Trending Now', type: 'trending' },
    'top-rated': { title: 'Top Rated Classics', type: 'top-rated' },
    'upcoming': { title: 'Coming Soon', type: 'upcoming' },
    'spain': { title: 'Made in Spain 🇪🇸', type: 'country', value: 'ES' },
    'bollywood': { title: 'Bollywood Hits (Hindi) 🇮🇳', type: 'language', value: 'hi' },
    'tollywood': { title: 'Tollywood Action (Telugu) 🇮🇳', type: 'language', value: 'te' },
    'kollywood': { title: 'Kollywood Cinema (Tamil) 🇮🇳', type: 'language', value: 'ta' },
    'mollywood': { title: 'Mollywood Gems (Malayalam) 🇮🇳', type: 'language', value: 'ml' },
    'sandalwood': { title: 'Sandalwood Favorites (Kannada) 🇮🇳', type: 'language', value: 'kn' },
    'marathi': { title: 'Marathi Masterpieces 🇮🇳', type: 'language', value: 'mr' },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export const getMoviesByCategory = async (slug: string): Promise<Movie[]> => {
    const config = CATEGORIES[slug as CategorySlug];
    if (!config) return [];

    switch (config.type) {
        case 'trending': return getTrendingMovies();
        case 'top-rated': return getTopRatedMovies();
        case 'upcoming': return getUpcomingMovies();
        case 'country': return getMoviesByCountry(config.value!);
        case 'language': return getMoviesByLanguage(config.value!);
        default: return [];
    }
};

export const getMoviesByLanguage = async (languageCode: string): Promise<Movie[]> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_original_language=${languageCode}&sort_by=popularity.desc&vote_count.gte=10`
    );
    if (!res.ok) throw new Error('Failed to fetch movies by language');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMovie = async (id: string): Promise<Movie> => {
    const res = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${env.TMDB_API_KEY}`
    );
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return res.json();
};
