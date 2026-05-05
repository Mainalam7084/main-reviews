import { searchMovies } from '@/lib/tmdb';
import { MovieCard } from '@/components/ui/movie-card';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const movies = await searchMovies(q);

    return (
        <div className="w-full">
            {/* Header section */}
            <div className="px-4 md:px-12 py-12 md:py-16 border-b-3 border-border bg-background">
                <div className="max-w-5xl">
                    <h1 className="text-4xl md:text-6xl font-display font-800 tracking-tighter uppercase text-foreground">
                        Search Results
                    </h1>
                    <p className="mt-4 text-xl font-500 text-muted-foreground font-sans">
                        Found {movies.length} {movies.length === 1 ? 'result' : 'results'} for <span className="font-700 text-[#E60000] decoration-3 underline underline-offset-4">"{q}"</span>
                    </p>
                </div>
            </div>

            <main className="w-full px-4 md:px-12 py-12 bg-background">
                {movies.length === 0 ? (
                    <div className="w-full max-w-2xl mx-auto py-16 px-8 border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] bg-card text-center">
                        <h2 className="text-2xl font-display font-800 uppercase tracking-tight text-foreground mb-4">No Matches Found</h2>
                        <p className="font-500 text-muted-foreground text-lg">
                            We couldn't find any movies matching your search. Try different keywords or check out what's trending.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
