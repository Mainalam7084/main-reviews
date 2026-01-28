import { NextRequest, NextResponse } from 'next/server';
import { createTMDBClient } from '@/lib/api/tmdb-client';
import { createOMDBClient } from '@/lib/api/omdb-client';
import { tmdbToMovieResult, omdbSearchToMovieResult, type MovieResult } from '@/lib/api/movie-types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');
        const page = parseInt(searchParams.get('page') || '1');

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        let results: MovieResult[] = [];
        let totalResults = 0;
        let source: 'tmdb' | 'omdb' = 'tmdb';

        // Try TMDB first
        try {
            const tmdbClient = createTMDBClient();
            const tmdbResponse = await tmdbClient.searchMovies(query, page);

            if (tmdbResponse.results.length > 0) {
                results = tmdbResponse.results.map(tmdbToMovieResult);
                totalResults = tmdbResponse.total_results;
                source = 'tmdb';

                // Add poster URLs
                results = results.map(result => ({
                    ...result,
                    poster: result.poster ? tmdbClient.getPosterUrl(result.poster) || undefined : undefined,
                }));
            } else {
                throw new Error('No TMDB results');
            }
        } catch (tmdbError) {
            console.warn('TMDB search failed, falling back to OMDb:', tmdbError);

            // Fallback to OMDb
            try {
                const omdbClient = createOMDBClient();
                const omdbResponse = await omdbClient.searchMovies(query, page);

                results = omdbResponse.Search.map(omdbSearchToMovieResult);
                totalResults = parseInt(omdbResponse.totalResults);
                source = 'omdb';
            } catch (omdbError) {
                console.error('OMDb search also failed:', omdbError);
                return NextResponse.json(
                    { error: 'Both TMDB and OMDb searches failed', results: [], totalResults: 0, source: 'none' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            results,
            totalResults,
            source,
            page,
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
