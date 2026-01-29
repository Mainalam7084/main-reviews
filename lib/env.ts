import { z } from 'zod';

const envSchema = z.object({
    TMDB_API_KEY: z.string().min(1),
    OMDB_API_KEY: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1), // Required for Neon Postgres
    NEXTAUTH_URL: z.string().url().optional(),
});

const isServer = typeof window === 'undefined';

// On the client, we don't have access to these secrets, so we mock them
// to avoid Zod schema validation errors during bundle evaluation.
export const env = isServer
    ? envSchema.parse({
        TMDB_API_KEY: process.env.TMDB_API_KEY,
        OMDB_API_KEY: process.env.OMDB_API_KEY,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    })
    : {
        TMDB_API_KEY: '',
        OMDB_API_KEY: '',
        NEXTAUTH_SECRET: '',
        DATABASE_URL: '',
        NEXTAUTH_URL: '',
    } as z.infer<typeof envSchema>;
