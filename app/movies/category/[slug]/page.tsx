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

    let filterLanguage: string | undefined = undefined;
    if (config.type === 'language') {
        filterLanguage = config.value;
    } else if (config.type === 'country' && slug === 'spain') {
        filterLanguage = 'es';
    }

    return (
        <div className="w-full">
            {/* Header section */}
            <div className="px-4 md:px-12 py-12 md:py-16 border-b-3 border-border bg-background">
                <div className="max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground">
                        {config.title}
                    </h1>
                    <p className="mt-4 text-xl font-500 text-muted-foreground font-sans max-w-2xl">
                        Explore the best movies in this collection. High-quality cinema curated for you.
                    </p>
                </div>
            </div>

            <main className="w-full px-4 md:px-12 py-12 bg-background">
                <CategorySearch initialMovies={movies} filterLanguage={filterLanguage} />
            </main>
        </div>
    );
}

