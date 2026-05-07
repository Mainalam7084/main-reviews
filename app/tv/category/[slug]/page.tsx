import { getTVByCategoryPaginated, TV_CATEGORIES, type TVCategorySlug } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { TVCategorySearch } from './search-ui';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(TV_CATEGORIES).map((slug) => ({ slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
    'trending':  '#E60000',
    'popular':   '#FFE500',
    'top-rated': '#00F5A0',
    'drama':     '#0066FF',
    'anime':     '#E60000',
    'crime':     '#0A0A0A',
    'comedy':    '#FFE500',
};

export default async function TVCategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const config = TV_CATEGORIES[slug as TVCategorySlug];

    if (!config) notFound();

    const { results: shows, total_pages } = await getTVByCategoryPaginated(slug, 1);
    const accentColor = CATEGORY_COLORS[slug] || '#0066FF';

    return (
        <div className="w-full">
            {/* Header */}
            <div className="py-12 md:py-20 border-b-3 border-border bg-background relative overflow-hidden">
                <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-border opacity-20 pointer-events-none"
                    style={{ backgroundColor: accentColor, boxShadow: `8px 8px 0px 0px var(--border)` }}
                />
                <div className="relative z-10 max-w-5xl px-4 md:px-8">
                    <Link href="/tv" className="inline-flex items-center gap-2 mb-8">
                        <BrutalButton variant="ghost" size="sm" className="text-xs">
                            <ArrowLeft size={14} /> Back to TV
                        </BrutalButton>
                    </Link>

                    <h1
                        className="text-5xl md:text-8xl font-display font-800 tracking-tighter uppercase text-foreground leading-[0.9]"
                        style={{ textShadow: `4px 4px 0px ${accentColor}` }}
                    >
                        {config.title}
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl font-500 text-muted-foreground font-sans max-w-2xl border-l-4 border-foreground pl-6">
                        Browse the best TV shows in this category.{' '}
                        <span className="text-foreground font-700">Premium streaming</span>, curated for you.
                    </p>
                </div>
            </div>

            <main className="w-full py-12 px-4 md:px-8 bg-background">
                <TVCategorySearch
                    initialShows={shows}
                    slug={slug}
                    initialTotalPages={total_pages}
                />
            </main>
        </div>
    );
}
