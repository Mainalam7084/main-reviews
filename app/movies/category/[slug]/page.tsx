import { Navbar } from '@/components/layout/navbar';
import { getMoviesByCategory, CATEGORIES, type CategorySlug } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { CategorySearch } from './search-ui';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const config = CATEGORIES[slug as CategorySlug];

    if (!config) {
        notFound();
    }

    const movies = await getMoviesByCategory(slug);

    // Determine the filter language if this is a language-specific category
    // For 'country', we might default to Spanish for 'spain' if we want to filter search results 
    // by language 'es' as a close approximation, or pass undefined if strict filtering is hard.
    // Given the user request, let's try to pass 'es' for Spain for better "search within section" feel.

    let filterLanguage: string | undefined = undefined;
    if (config.type === 'language') {
        filterLanguage = config.value;
    } else if (config.type === 'country' && slug === 'spain') {
        filterLanguage = 'es';
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-red-600 mb-2">{config.title}</h1>
                    <p className="text-gray-400">Explore the best movies in this collection.</p>
                </div>

                <CategorySearch initialMovies={movies} filterLanguage={filterLanguage} />
            </main>
        </div>
    );
}
