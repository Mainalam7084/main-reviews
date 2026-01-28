'use server';

import { searchMoviesWithFilter } from '@/lib/tmdb';

export async function searchMovies(query: string, language?: string) {
    return await searchMoviesWithFilter(query, language);
}
