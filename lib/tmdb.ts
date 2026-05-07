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

export interface Person {
    id: number;
    name: string;
    profile_path: string | null;
    known_for_department: string;
    popularity: number;
    known_for: Movie[];
}

export interface PersonDetail {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    profile_path: string | null;
    known_for_department: string;
    popularity: number;
    homepage: string | null;
}

export interface WatchProvider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
}

export interface WatchProviders {
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
    link?: string;
}

// ─── Image helpers ───────────────────────────────────────────────────────────

export const getImageUrl = (path: string | null, size = 'w500') => {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

// ─── Movies ──────────────────────────────────────────────────────────────────

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch trending movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${env.TMDB_API_KEY}&page=1`);
    if (!res.ok) throw new Error('Failed to fetch top rated movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${env.TMDB_API_KEY}&page=1`);
    if (!res.ok) throw new Error('Failed to fetch upcoming movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${env.TMDB_API_KEY}&page=1`);
    if (!res.ok) throw new Error('Failed to fetch now playing movies');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMoviesByCountry = async (countryCode: string): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc`);
    if (!res.ok) throw new Error('Failed to fetch movies by country');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMoviesByLanguage = async (languageCode: string): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_original_language=${languageCode}&sort_by=popularity.desc&vote_count.gte=10`);
    if (!res.ok) throw new Error('Failed to fetch movies by language');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=100`);
    if (!res.ok) throw new Error('Failed to fetch movies by genre');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const searchMoviesWithFilter = async (query: string, language?: string): Promise<Movie[]> => {
    if (!query) return [];
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`);
    if (!res.ok) throw new Error('Failed to search movies');
    const data: TmdbSearchResponse = await res.json();
    let results = data.results;
    if (language) {
        results = results.filter(movie => (movie as any).original_language === language);
    }
    return results;
};

export const getMovie = async (id: string): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return res.json();
};

export const getMovieCredits = async (id: string): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch movie credits');
    return res.json();
};

export const getSimilarMovies = async (id: string): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/similar?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch similar movies');
    const data = await res.json();
    return data.results;
};

export const getWatchProviders = async (id: string, region = 'US'): Promise<WatchProviders | null> => {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${env.TMDB_API_KEY}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.results?.[region] ?? null;
    } catch {
        return null;
    }
};

export const getCollection = async (collectionId: number): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/collection/${collectionId}?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) return null;
    return res.json();
};

// ─── People ──────────────────────────────────────────────────────────────────

export const getPopularPeople = async (page = 1): Promise<Person[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/person/popular?api_key=${env.TMDB_API_KEY}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch popular people');
    const data = await res.json();
    return data.results;
};

export const getPersonDetails = async (id: string): Promise<PersonDetail> => {
    const res = await fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch person details');
    return res.json();
};

export const getPersonMovieCredits = async (id: string): Promise<{ cast: any[]; crew: any[] }> => {
    const res = await fetch(`${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch person movie credits');
    return res.json();
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = {
    // Core
    'trending':    { title: 'Trending Now',            type: 'trending' },
    'top-rated':   { title: 'Top Rated Classics',      type: 'top-rated' },
    'upcoming':    { title: 'Coming Soon',             type: 'upcoming' },
    'now-playing': { title: 'Now Playing',             type: 'now-playing' },
    // Genres
    'action':      { title: 'Action & Adventure',      type: 'genre', value: 28 },
    'comedy':      { title: 'Comedy',                  type: 'genre', value: 35 },
    'drama':       { title: 'Drama',                   type: 'genre', value: 18 },
    'horror':      { title: 'Horror',                  type: 'genre', value: 27 },
    'thriller':    { title: 'Thriller',                type: 'genre', value: 53 },
    'sci-fi':      { title: 'Science Fiction',         type: 'genre', value: 878 },
    'romance':     { title: 'Romance',                 type: 'genre', value: 10749 },
    'animation':   { title: 'Animation',               type: 'genre', value: 16 },
    'documentary': { title: 'Documentary',             type: 'genre', value: 99 },
    // Regional
    'spain':       { title: 'Made in Spain 🇪🇸',        type: 'country', value: 'ES' },
    'bollywood':   { title: 'Bollywood Hits (Hindi) 🇮🇳', type: 'language', value: 'hi' },
    'tollywood':   { title: 'Tollywood Action (Telugu) 🇮🇳', type: 'language', value: 'te' },
    'kollywood':   { title: 'Kollywood Cinema (Tamil) 🇮🇳', type: 'language', value: 'ta' },
    'mollywood':   { title: 'Mollywood Gems (Malayalam) 🇮🇳', type: 'language', value: 'ml' },
    'sandalwood':  { title: 'Sandalwood Favorites (Kannada) 🇮🇳', type: 'language', value: 'kn' },
    'marathi':     { title: 'Marathi Masterpieces 🇮🇳', type: 'language', value: 'mr' },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export const getMoviesByCategory = async (slug: string): Promise<Movie[]> => {
    const config = CATEGORIES[slug as CategorySlug];
    if (!config) return [];

    switch (config.type) {
        case 'trending':    return getTrendingMovies();
        case 'top-rated':   return getTopRatedMovies();
        case 'upcoming':    return getUpcomingMovies();
        case 'now-playing': return getNowPlayingMovies();
        case 'genre':       return getMoviesByGenre((config as any).value as number);
        case 'country':     return getMoviesByCountry((config as any).value as string);
        case 'language':    return getMoviesByLanguage((config as any).value as string);
        default:            return [];
    }
};
