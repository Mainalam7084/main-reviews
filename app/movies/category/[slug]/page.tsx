import { getMoviesByCategory, CATEGORIES, type CategorySlug } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { CategorySearch } from './search-ui';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
    'trending':    'var(--primary)',
    'top-rated':   '#FFE500',
    'upcoming':    '#0066FF',
    'now-playing': '#00F5A0',
    'action':      '#E60000',
    'comedy':      '#FFE500',
    'drama':       '#0066FF',
    'horror':      '#0A0A0A',
    'thriller':    '#E60000',
    'sci-fi':      '#0066FF',
    'romance':     '#E60000',
    'animation':   '#00F5A0',
    'documentary': '#FFE500',
    'spain':       '#E60000',
    'bollywood':   '#00F5A0',
    'tollywood':   '#E60000',
    'kollywood':   '#E60000',
    'mollywood':   '#0066FF',
    'sandalwood':  '#FFE500',
    'marathi':     '#00F5A0',
};

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const config = CATEGORIES[slug as CategorySlug];

    if (!config) {
        notFound();
    }

    const movies = await getMoviesByCategory(slug);
    const accentColor = CATEGORY_COLORS[slug] || 'var(--primary)';

    let filterLanguage: string | undefined = undefined;
    if (config.type === 'language') {
        filterLanguage = config.value;
    } else if (config.type === 'country' && slug === 'spain') {
        filterLanguage = 'es';
    }

    return (
        <div className="w-full">
            {/* Header section */}
            <div className="py-12 md:py-20 border-b-3 border-border bg-background relative overflow-hidden">
                {/* Decorative float element */}
                <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-border opacity-20 animate-float pointer-events-none"
                    style={{ backgroundColor: accentColor, boxShadow: `8px 8px 0px 0px var(--border)` }}
                />

                <div className="relative z-10 max-w-5xl">
                    <Link href="/movies" className="inline-flex items-center gap-2 mb-8 group">
                        <BrutalButton variant="ghost" size="sm" className="text-xs">
                            <ArrowLeft size={14} /> Back to Movies
                        </BrutalButton>
                    </Link>

                    <h1
                        className="text-5xl md:text-8xl font-display font-800 tracking-tighter uppercase text-foreground leading-[0.9]"
                        style={{ textShadow: `4px 4px 0px ${accentColor}` }}
                    >
                        {config.title}
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl font-500 text-muted-foreground font-sans max-w-2xl border-l-4 border-foreground pl-6">
                        Explore the best movies in this collection. <span className="text-foreground font-700">Premium cinema</span>, curated for you.
                    </p>
                </div>
            </div>

            <main className="w-full py-12 bg-background">
                <CategorySearch initialMovies={movies} filterLanguage={filterLanguage} />
            </main>
        </div>
    );
}


