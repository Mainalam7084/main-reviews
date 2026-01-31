import { Navbar } from '@/components/layout/navbar';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <section className="space-y-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            About <span className="text-red-600">MainReviews</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            The ultimate platform for movie enthusiasts to track their journey, share opinions, and discover new favorites.
                        </p>
                    </section>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 pt-8">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.61 0 4.09 1.61 7.09 1.61 4.2 0 2.91 0 2.91 0s-1-.62-1-3V6c0-2.42 1.91-2 1.91-2S19.56 5.5 16 5.5c-3.03 0-5.5-1.5-5.5-1.5S7.97 5.5 5 5.5c-3.16 0-4.09 1.5-4.09 1.5s2 .42 2 2v10.5c0 2.29-.91 3-.91 3s1.29 0 2.91 0c3 0 5.48-1.61 7.09-1.61Z" /><path d="M12 4v16.94" /></svg>
                            </div>
                            <h3 className="text-xl font-bold">Track Your Watchlist</h3>
                            <p className="text-gray-400 text-sm">
                                Never forget a movie you've seen. Keep a comprehensive history of everything you've watched and want to watch.
                            </p>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            </div>
                            <h3 className="text-xl font-bold">Rate & Review</h3>
                            <p className="text-gray-400 text-sm">
                                Share your detailed thoughts. Go beyond a simple thumbs up with our comprehensive rating system.
                            </p>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                            </div>
                            <h3 className="text-xl font-bold">Share with Friends</h3>
                            <p className="text-gray-400 text-sm">
                                See what your friends are watching. Build a community around your shared love for cinema.
                            </p>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We started MainSpaceVision because we felt that existing movie platforms were too cluttered or too focused on just metrics. We wanted a place that celebrates the <em>experience</em> of watching movies—the feelings, the details, and the discussions that follow. Whether you're a casual viewer or a hardcore cinephile, this is your home.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <h2 className="text-2xl font-bold mb-6">Ready to start your collection?</h2>
                        <Link href="/movies">
                            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-all transform hover:scale-105">
                                Browse Movies
                            </button>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
