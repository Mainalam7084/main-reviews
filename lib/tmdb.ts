import { env } from './env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    overview: string;
    vote_average: number;
}

export interface TVShow {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    overview: string;
    vote_average: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
}

export interface TmdbSearchResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface TmdbTVResponse {
    page: number;
    results: TVShow[];
    total_pages: number;
    total_results: number;
}

export interface PaginatedResult<T> {
    results: T[];
    page: number;
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

export const getMoviesByGenreAndLanguage = async (genreId: number, languageCode: string): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_genres=${genreId}&with_original_language=${languageCode}&sort_by=popularity.desc&vote_count.gte=20`);
    if (!res.ok) throw new Error('Failed to fetch movies by genre and language');
    const data: TmdbSearchResponse = await res.json();
    return data.results;
};

export const getMoviesByMultipleCountries = async (countryCodes: string[]): Promise<Movie[]> => {
    const countries = countryCodes.join('|');
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_origin_country=${encodeURIComponent(countries)}&sort_by=popularity.desc&vote_count.gte=50`);
    if (!res.ok) throw new Error('Failed to fetch movies by countries');
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

export const getTVWatchProviders = async (id: string, region = 'US'): Promise<WatchProviders | null> => {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/watch/providers?api_key=${env.TMDB_API_KEY}`);
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

// ─── Paginated movie fetchers (for Load More) ────────────────────────────────

export const getMoviesByCategoryPaginated = async (slug: string, page = 1): Promise<PaginatedResult<Movie>> => {
    const config = CATEGORIES[slug as CategorySlug];
    if (!config) return { results: [], page: 1, total_pages: 1, total_results: 0 };

    let url = '';
    switch (config.type) {
        case 'trending':
            url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'top-rated':
            url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'upcoming':
            url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'now-playing':
            url = `${TMDB_BASE_URL}/movie/now_playing?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'genre':
            url = `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_genres=${(config as any).value}&sort_by=popularity.desc&vote_count.gte=100&page=${page}`;
            break;
        case 'language':
            url = `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_original_language=${(config as any).value}&sort_by=popularity.desc&vote_count.gte=10&page=${page}`;
            break;
        case 'genre-lang': {
            const v = (config as any).value as { genre: number; lang: string };
            url = `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_genres=${v.genre}&with_original_language=${v.lang}&sort_by=popularity.desc&vote_count.gte=20&page=${page}`;
            break;
        }
        case 'multi-country':
            url = `${TMDB_BASE_URL}/discover/movie?api_key=${env.TMDB_API_KEY}&with_origin_country=${encodeURIComponent((config as any).value)}&sort_by=popularity.desc&vote_count.gte=50&page=${page}`;
            break;
        default:
            return { results: [], page: 1, total_pages: 1, total_results: 0 };
    }

    const res = await fetch(url);
    if (!res.ok) return { results: [], page: 1, total_pages: 1, total_results: 0 };
    const data: TmdbSearchResponse = await res.json();
    return { results: data.results, page: data.page, total_pages: data.total_pages, total_results: data.total_results };
};

// ─── TV Shows ─────────────────────────────────────────────────────────────────

export const getTrendingTV = async (): Promise<TVShow[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch trending TV');
    const data: TmdbTVResponse = await res.json();
    return data.results;
};

export const getPopularTV = async (): Promise<TVShow[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch popular TV');
    const data: TmdbTVResponse = await res.json();
    return data.results;
};

export const getTopRatedTV = async (): Promise<TVShow[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch top rated TV');
    const data: TmdbTVResponse = await res.json();
    return data.results;
};

export const getTVShowsByGenre = async (genreId: number): Promise<TVShow[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=50`);
    if (!res.ok) throw new Error('Failed to fetch TV shows by genre');
    const data: TmdbTVResponse = await res.json();
    return data.results;
};

export const getTVShow = async (id: string): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch TV show details');
    return res.json();
};

export const getTVShowCredits = async (id: string): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/credits?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch TV show credits');
    return res.json();
};

export const getSimilarTVShows = async (id: string): Promise<TVShow[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/similar?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch similar TV shows');
    const data = await res.json();
    return data.results;
};

export const getTVShowSeason = async (id: string, seasonNumber: number): Promise<any> => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${env.TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch TV season');
    return res.json();
};

export const getTVByCategoryPaginated = async (slug: string, page = 1): Promise<PaginatedResult<TVShow>> => {
    const config = TV_CATEGORIES[slug as TVCategorySlug];
    if (!config) return { results: [], page: 1, total_pages: 1, total_results: 0 };

    let url = '';
    switch (config.type) {
        case 'trending':
            url = `${TMDB_BASE_URL}/trending/tv/week?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'popular':
            url = `${TMDB_BASE_URL}/tv/popular?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'top-rated':
            url = `${TMDB_BASE_URL}/tv/top_rated?api_key=${env.TMDB_API_KEY}&page=${page}`;
            break;
        case 'genre':
            url = `${TMDB_BASE_URL}/discover/tv?api_key=${env.TMDB_API_KEY}&with_genres=${(config as any).value}&sort_by=popularity.desc&vote_count.gte=50&page=${page}`;
            break;
        default:
            return { results: [], page: 1, total_pages: 1, total_results: 0 };
    }

    const res = await fetch(url);
    if (!res.ok) return { results: [], page: 1, total_pages: 1, total_results: 0 };
    const data: TmdbTVResponse = await res.json();
    return { results: data.results, page: data.page, total_pages: data.total_pages, total_results: data.total_results };
};

// ─── People ──────────────────────────────────────────────────────────────────

export const getPopularPeople = async (page = 1): Promise<Person[]> => {
    const res = await fetch(`${TMDB_BASE_URL}/person/popular?api_key=${env.TMDB_API_KEY}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch popular people');
    const data = await res.json();
    return data.results;
};

export const getPopularPeoplePaginated = async (page = 1): Promise<PaginatedResult<Person>> => {
    const res = await fetch(`${TMDB_BASE_URL}/person/popular?api_key=${env.TMDB_API_KEY}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch popular people');
    const data = await res.json();
    return { results: data.results, page: data.page, total_pages: data.total_pages, total_results: data.total_results };
};

export const getPopularDirectors = async (): Promise<Person[]> => {
    const pages = await Promise.all(
        [1, 2, 3, 4, 5].map((p) =>
            fetch(`${TMDB_BASE_URL}/person/popular?api_key=${env.TMDB_API_KEY}&page=${p}`)
                .then((r) => r.json())
                .then((d) => d.results as Person[])
        )
    );
    return pages.flat().filter((p) => p.known_for_department === 'Directing');
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
    'trending':      { title: 'Trending Now',                       type: 'trending' },
    'top-rated':     { title: 'Top Rated Classics',                 type: 'top-rated' },
    'upcoming':      { title: 'Coming Soon',                        type: 'upcoming' },
    'now-playing':   { title: 'Now Playing',                        type: 'now-playing' },
    // Genres
    'action':        { title: 'Action & Adventure',                 type: 'genre',         value: 28 },
    'comedy':        { title: 'Comedy',                             type: 'genre',         value: 35 },
    'drama':         { title: 'Drama',                              type: 'genre',         value: 18 },
    'horror':        { title: 'Horror',                             type: 'genre',         value: 27 },
    'thriller':      { title: 'Thriller',                           type: 'genre',         value: 53 },
    'sci-fi':        { title: 'Science Fiction',                    type: 'genre',         value: 878 },
    'romance':       { title: 'Romance',                            type: 'genre',         value: 10749 },
    'animation':     { title: 'Animation',                          type: 'genre',         value: 16 },
    'documentary':   { title: 'Documentary',                        type: 'genre',         value: 99 },
    // Global Cinema
    'japanese':      { title: 'Japanese Cinema 🇯🇵',                type: 'language',      value: 'ja' },
    'chinese':       { title: 'Chinese Cinema 🇨🇳',                 type: 'language',      value: 'zh' },
    'korean':        { title: 'Korean Cinema 🇰🇷',                  type: 'language',      value: 'ko' },
    'bollywood':     { title: 'Bollywood Hits (Hindi) 🇮🇳',         type: 'language',      value: 'hi' },
    'tollywood':     { title: 'Tollywood Action (Telugu) 🇮🇳',      type: 'language',      value: 'te' },
    'kollywood':     { title: 'Kollywood Cinema (Tamil) 🇮🇳',       type: 'language',      value: 'ta' },
    'mollywood':     { title: 'Mollywood Gems (Malayalam) 🇮🇳',     type: 'language',      value: 'ml' },
    'sandalwood':    { title: 'Sandalwood Favorites (Kannada) 🇮🇳', type: 'language',      value: 'kn' },
    'marathi':       { title: 'Marathi Masterpieces 🇮🇳',           type: 'language',      value: 'mr' },
    'european':      { title: 'European Cinema 🇪🇺',                type: 'multi-country', value: 'FR|DE|IT' },
    'anime-movies':  { title: 'Anime Movies 🎌',                    type: 'genre-lang',    value: { genre: 16, lang: 'ja' } },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export const getMoviesByCategory = async (slug: string): Promise<Movie[]> => {
    const config = CATEGORIES[slug as CategorySlug];
    if (!config) return [];

    switch (config.type) {
        case 'trending':      return getTrendingMovies();
        case 'top-rated':     return getTopRatedMovies();
        case 'upcoming':      return getUpcomingMovies();
        case 'now-playing':   return getNowPlayingMovies();
        case 'genre':         return getMoviesByGenre((config as any).value as number);
        case 'language':      return getMoviesByLanguage((config as any).value as string);
        case 'multi-country': return getMoviesByMultipleCountries(((config as any).value as string).split('|'));
        case 'genre-lang': {
            const v = (config as any).value as { genre: number; lang: string };
            return getMoviesByGenreAndLanguage(v.genre, v.lang);
        }
        default: return [];
    }
};

// ─── TV Categories ────────────────────────────────────────────────────────────

export const TV_CATEGORIES = {
    'trending':  { title: 'Trending TV Shows', type: 'trending' },
    'popular':   { title: 'Popular Now',        type: 'popular' },
    'top-rated': { title: 'Top Rated Series',   type: 'top-rated' },
    'drama':     { title: 'Drama Series',       type: 'genre', value: 18 },
    'anime':     { title: 'Anime',              type: 'genre', value: 16 },
    'crime':     { title: 'Crime & Mystery',    type: 'genre', value: 80 },
    'comedy':    { title: 'Comedy Shows',       type: 'genre', value: 35 },
} as const;

export type TVCategorySlug = keyof typeof TV_CATEGORIES;

export const getTVByCategory = async (slug: string): Promise<TVShow[]> => {
    const config = TV_CATEGORIES[slug as TVCategorySlug];
    if (!config) return [];

    switch (config.type) {
        case 'trending':  return getTrendingTV();
        case 'popular':   return getPopularTV();
        case 'top-rated': return getTopRatedTV();
        case 'genre':     return getTVShowsByGenre((config as any).value as number);
        default:          return [];
    }
};

// ─── Popular Collections ──────────────────────────────────────────────────────

export const POPULAR_COLLECTIONS = [
    // Wizarding World
    { id: 1241,   name: 'Harry Potter',            slug: 'harry-potter' },
    { id: 435259, name: 'Fantastic Beasts',         slug: 'fantastic-beasts' },
    // Marvel Cinematic Universe
    { id: 86311,  name: 'The Avengers',             slug: 'avengers' },
    { id: 131292, name: 'Iron Man',                 slug: 'iron-man' },
    { id: 131295, name: 'Captain America',          slug: 'captain-america' },
    { id: 131296, name: 'Thor',                     slug: 'thor' },
    { id: 284433, name: 'Guardians of the Galaxy',  slug: 'guardians-of-the-galaxy' },
    // Spider-Man
    { id: 531241, name: 'Spider-Man',               slug: 'spider-man' },
    { id: 556,    name: 'Spider-Man (Raimi)',        slug: 'spider-man-raimi' },
    { id: 125574, name: 'The Amazing Spider-Man',   slug: 'amazing-spider-man' },
    // James Bond
    { id: 645,    name: 'James Bond',               slug: 'james-bond' },
    // Middle-earth
    { id: 119,    name: 'Lord of the Rings',        slug: 'lord-of-the-rings' },
    { id: 121938, name: 'The Hobbit',               slug: 'the-hobbit' },
    // Action franchises
    { id: 9485,   name: 'Fast & Furious',           slug: 'fast-and-furious' },
    { id: 404609, name: 'John Wick',                slug: 'john-wick' },
    // Dinosaurs
    { id: 328,    name: 'Jurassic Park',            slug: 'jurassic-park' },
] as const;
