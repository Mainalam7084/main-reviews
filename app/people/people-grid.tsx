'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, type Person } from '@/lib/tmdb';
import { Loader2 } from 'lucide-react';

interface Props {
    initialPeople: Person[];
    initialPage: number;
    totalPages: number;
}

export function PeopleGrid({ initialPeople, initialPage, totalPages }: Props) {
    const [people, setPeople] = useState<Person[]>(initialPeople);
    const [page, setPage] = useState(initialPage);
    const [isPending, startTransition] = useTransition();

    const hasMore = page < totalPages;

    function loadMore() {
        startTransition(async () => {
            const nextPage = page + 1;
            const res = await fetch(`/api/people/paginated?page=${nextPage}`);
            const data = await res.json();
            setPeople((prev) => [...prev, ...data.results]);
            setPage(data.page);
        });
    }

    return (
        <>
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

            {hasMore && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-8 py-3 font-display font-700 uppercase tracking-widest text-sm border-3 border-border bg-background hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform duration-150 disabled:opacity-60 disabled:pointer-events-none"
                        style={{ boxShadow: '5px 5px 0px 0px var(--border)' }}
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}
        </>
    );
}
