'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FFE500] p-4 noise-overlay">
            <div className="w-full max-w-md space-y-8 bg-card border-3 border-border p-8 md:p-12 shadow-[8px_8px_0px_0px_var(--border)] relative">
                
                {/* Decorative element */}
                <div className="absolute -top-4 -right-4 text-6xl rotate-12 drop-shadow-[4px_4px_0px_var(--border)]">
                    🍿
                </div>

                <div className="text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-display font-800 tracking-tighter uppercase text-foreground" style={{ textShadow: '2px 2px 0px var(--primary)' }}>
                        Sign Up
                    </h2>
                    <p className="mt-2 text-base font-600 font-sans text-muted-foreground uppercase tracking-widest">
                        Join the boldest cinema club
                    </p>
                </div>

                {error && (
                    <div className="bg-[#E60000] border-2 border-border text-white px-4 py-3 font-display font-700 shadow-[3px_3px_0px_0px_var(--border)] text-center text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground mb-2">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="brutal-input block w-full p-4 text-base placeholder-muted-foreground"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground mb-2">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="brutal-input block w-full p-4 text-base placeholder-muted-foreground"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="brutal-input block w-full p-4 text-base placeholder-muted-foreground"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                        />
                    </div>

                    <div className="pt-4">
                        <BrutalButton
                            type="submit"
                            disabled={loading}
                            variant="primary"
                            size="lg"
                            fullWidth
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </BrutalButton>
                    </div>
                </form>

                <div className="text-center text-sm font-600 font-sans mt-8 relative z-10">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link
                        href="/auth/login"
                        className="text-foreground hover:text-primary transition-colors underline decoration-2 underline-offset-4 font-700"
                    >
                        Sign in now
                    </Link>
                </div>
            </div>
        </div>
    );
}
