import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';

export default function AboutPage() {
    return (
        <div className="w-full bg-background min-h-screen">
            {/* Header Section */}
            <section className="bg-[#00F5A0] px-4 md:px-12 py-20 md:py-32 border-b-3 border-border relative overflow-hidden noise-overlay">
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-block bg-[#0A0A0A] text-[#F5F0E8] px-4 py-1 border-2 border-[#F5F0E8] font-display font-800 uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_#F5F0E8] -rotate-2">
                        Who we are
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tighter uppercase text-[#0A0A0A]" style={{ textShadow: '4px 4px 0px #FFFFFF' }}>
                        About <span className="text-[#E60000]" style={{ textShadow: '4px 4px 0px #0A0A0A' }}>MainReviews</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-500 text-[#0A0A0A] max-w-2xl mx-auto font-sans leading-relaxed">
                        The ultimate platform for movie enthusiasts to track their journey, share unapologetic opinions, and discover new favorites.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFE500] border-4 border-border rounded-full shadow-[4px_4px_0px_0px_var(--border)] animate-float" />
                <div className="loader !absolute bottom-4 right-4 md:bottom-10 md:right-10 scale-75 md:scale-100 opacity-80"></div>
            </section>

            <main className="container mx-auto px-4 md:px-12 py-16 md:py-24">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] p-8 space-y-4 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[10px_10px_0px_0px_var(--primary)] transition-all duration-300">
                            <div className="w-16 h-16 bg-[#E60000] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-white mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.61 0 4.09 1.61 7.09 1.61 4.2 0 2.91 0 2.91 0s-1-.62-1-3V6c0-2.42 1.91-2 1.91-2S19.56 5.5 16 5.5c-3.03 0-5.5-1.5-5.5-1.5S7.97 5.5 5 5.5c-3.16 0-4.09 1.5-4.09 1.5s2 .42 2 2v10.5c0 2.29-.91 3-.91 3s1.29 0 2.91 0c3 0 5.48-1.61 7.09-1.61Z" /><path d="M12 4v16.94" /></svg>
                            </div>
                            <h3 className="text-2xl font-display font-800 uppercase tracking-tight">Track Your Watchlist</h3>
                            <p className="text-muted-foreground font-sans font-500 leading-relaxed">
                                Never forget a movie you've seen. Keep a comprehensive history of everything you've watched and want to watch.
                            </p>
                        </div>

                        <div className="bg-card border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] p-8 space-y-4 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[10px_10px_0px_0px_var(--secondary)] transition-all duration-300 transform md:translate-y-4">
                            <div className="w-16 h-16 bg-[#FFE500] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-[#0A0A0A] mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            </div>
                            <h3 className="text-2xl font-display font-800 uppercase tracking-tight">Rate & Review</h3>
                            <p className="text-muted-foreground font-sans font-500 leading-relaxed">
                                Share your detailed thoughts. Go beyond a simple thumbs up with our comprehensive rating and verdict system.
                            </p>
                        </div>

                        <div className="bg-card border-3 border-border shadow-[6px_6px_0px_0px_var(--border)] p-8 space-y-4 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[10px_10px_0px_0px_#E60000] transition-all duration-300 transform md:translate-y-8">
                            <div className="w-16 h-16 bg-[#E60000] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] flex items-center justify-center text-white mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                            </div>
                            <h3 className="text-2xl font-display font-800 uppercase tracking-tight">Share with Friends</h3>
                            <p className="text-muted-foreground font-sans font-500 leading-relaxed">
                                See what your friends are watching. Build a community around your shared love for bold cinema.
                            </p>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="bg-[#0A0A0A] text-[#F5F0E8] border-3 border-[#F5F0E8] p-8 md:p-12 shadow-[8px_8px_0px_0px_#E60000] relative">
                        <h2 className="text-3xl md:text-5xl font-display font-800 uppercase tracking-tighter mb-6 text-[#FFE500]">
                            Our Mission
                        </h2>
                        <p className="text-lg md:text-xl font-sans font-500 leading-relaxed">
                            We started MainReviews because we felt that existing movie platforms were too cluttered, too generic, or too focused on just metrics. We wanted a place that celebrates the <span className="bg-[#E60000] px-2 text-white">experience</span> of watching movies—the feelings, the details, and the discussions that follow. Whether you're a casual viewer or a hardcore cinephile, this is your home.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <h2 className="text-3xl font-display font-800 uppercase tracking-tighter mb-8">Ready to start your collection?</h2>
                        <Link href="/movies">
                            <BrutalButton variant="primary" size="xl">
                                Browse Movies Now
                            </BrutalButton>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
