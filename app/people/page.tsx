import { getPopularPeople, getImageUrl, type Person } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';

export default async function PeoplePage() {
    const people = await getPopularPeople();

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {people.map((person: Person) => (
                        <Link
                            key={person.id}
                            href={`/people/${person.id}`}
                            className="group block"
                        >
                            <div
                                className="bg-card border-3 border-border group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200"
                                style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
                            >
                                {/* Photo */}
                                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted border-b-3 border-border">
                                    {person.profile_path ? (
                                        <Image
                                            src={getImageUrl(person.profile_path)}
                                            alt={person.name}
                                            fill
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="font-display font-700 text-muted-foreground uppercase text-2xl">
                                                {person.name[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-display font-700 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                        {person.name}
                                    </h3>
                                    <p className="mt-1 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                                        {person.known_for_department}
                                    </p>
                                    {person.known_for?.length > 0 && (
                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                            {person.known_for.slice(0, 2).map((m) => m.title).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
