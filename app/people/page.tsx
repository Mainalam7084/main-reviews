import { getPopularPeoplePaginated } from '@/lib/tmdb';
import { PeopleGrid } from './people-grid';

export default async function PeoplePage() {
    const { results, page, total_pages } = await getPopularPeoplePaginated(1);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="py-12 md:py-16 border-b-3 border-border bg-background px-4 md:px-8">
                <div className="max-w-5xl">
                    <div className="inline-block bg-[#E60000] text-white px-3 py-1 border-2 border-border font-display font-700 uppercase text-xs tracking-widest mb-4"
                         style={{ boxShadow: '3px 3px 0px 0px var(--border)' }}>
                        Spotlight
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-foreground"
                        style={{ textShadow: '4px 4px 0px var(--primary)' }}>
                        People
                    </h1>
                    <div className="h-1.5 w-24 bg-foreground mt-3" />
                    <p className="mt-4 text-xl font-500 text-muted-foreground max-w-2xl font-sans">
                        The faces behind your favourite films — actors, directors, and the talent that shapes cinema.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <main className="px-4 md:px-8 py-12">
                <PeopleGrid
                    initialPeople={results}
                    initialPage={page}
                    totalPages={total_pages}
                />
            </main>
        </div>
    );
}
