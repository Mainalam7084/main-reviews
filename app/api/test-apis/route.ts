import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { env } from '@/lib/env';

export async function GET() {
    const tmdbKey = env.TMDB_API_KEY;
    const omdbKey = env.OMDB_API_KEY;
=======

export async function GET() {
    const tmdbKey = process.env.TMDB_API_KEY;
    const omdbKey = process.env.OMDB_API_KEY;
>>>>>>> 132b2a07c3ae41f3acf59fcde857a8b1a4ccd4fa

    const results = {
        tmdb: { status: 'unknown', message: '' },
        omdb: { status: 'unknown', message: '' },
        env: {
            TMDB_API_KEY_CONFIGURED: tmdbKey && tmdbKey !== 'your_tmdb_api_key_here',
            OMDB_API_KEY_CONFIGURED: omdbKey && omdbKey !== 'your_omdb_api_key_here',
        }
    };

    // Test TMDB
    try {
        if (!tmdbKey || tmdbKey === 'your_tmdb_api_key_here') {
            results.tmdb.status = 'error';
            results.tmdb.message = 'API Key is missing or default';
        } else {
            const tmdbRes = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`);
            if (tmdbRes.ok) {
                results.tmdb.status = 'success';
                results.tmdb.message = 'Connected successfully';
            } else {
                const err = await tmdbRes.json();
                results.tmdb.status = 'error';
                results.tmdb.message = err.status_message || 'Invalid API Key';
            }
        }
    } catch (e: any) {
        results.tmdb.status = 'error';
        results.tmdb.message = e.message;
    }

    // Test OMDb
    try {
        if (!omdbKey || omdbKey === 'your_omdb_api_key_here') {
            results.omdb.status = 'error';
            results.omdb.message = 'API Key is missing or default';
        } else {
            const omdbRes = await fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&s=inception`);
            if (omdbRes.ok) {
                const data = await omdbRes.json();
                if (data.Response === 'True') {
                    results.omdb.status = 'success';
                    results.omdb.message = 'Connected successfully';
                } else {
                    results.omdb.status = 'error';
                    results.omdb.message = data.Error || 'Invalid API Key';
                }
            } else {
                results.omdb.status = 'error';
                results.omdb.message = 'Network Error';
            }
        }
    } catch (e: any) {
        results.omdb.status = 'error';
        results.omdb.message = e.message;
    }

    return NextResponse.json(results);
}
