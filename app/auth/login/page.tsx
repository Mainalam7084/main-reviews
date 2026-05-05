'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/brutal-button';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid credentials');
            } else {
                router.push('/'); // Redirect on success
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-card border-3 border-border p-8 md:p-12 shadow-[8px_8px_0px_0px_var(--border)] relative">
            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#E60000] border-3 border-border shadow-[4px_4px_0px_0px_var(--border)]" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#FFE500] border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] rounded-full" />

            <div className="text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-800 tracking-tighter uppercase text-foreground" style={{ textShadow: '2px 2px 0px var(--primary)' }}>
                    Sign In
                </h2>
                <p className="mt-2 text-base font-600 font-sans text-muted-foreground uppercase tracking-widest">
                    Welcome back
                </p>
            </div>

            {registered && (
                <div className="bg-[#00F5A0] border-2 border-border text-[#0A0A0A] px-4 py-3 font-display font-700 shadow-[3px_3px_0px_0px_var(--border)] text-center text-sm">
                    Account created! Please sign in.
                </div>
            )}

            {error && (
                <div className="bg-[#E60000] border-2 border-border text-white px-4 py-3 font-display font-700 shadow-[3px_3px_0px_0px_var(--border)] text-center text-sm">
                    {error}
                </div>
            )}

            <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-5">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            autoComplete="current-password"
                            required
                            className="brutal-input block w-full p-4 text-base placeholder-muted-foreground"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <BrutalButton
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        size="lg"
                        fullWidth
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </BrutalButton>
                </div>
            </form>

            <div className="text-center text-sm font-600 font-sans mt-8 relative z-10">
                <span className="text-muted-foreground">New to MainReviews? </span>
                <Link href="/auth/register" className="text-foreground hover:text-primary transition-colors underline decoration-2 underline-offset-4 font-700">
                    Sign up now
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4 noise-overlay">
            <Suspense fallback={<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
