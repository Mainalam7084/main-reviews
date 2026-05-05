'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
    Sun, Moon, User, LogOut, Settings, ChevronDown,
    Film, Star, Home, Info, Menu, X, Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/reviews', label: 'My Reviews', icon: Star },
    { href: '/about', label: 'About', icon: Info },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <motion.aside
                initial={false}
                animate={{ x: mobileOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-background border-r-3 border-border lg:translate-x-0 lg:![transform:none] lg:z-30"
                style={{ borderRight: '3px solid var(--border)' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 h-16 shrink-0" style={{ borderBottom: '3px solid var(--border)' }}>
                    <Link href="/" onClick={onClose}>
                        <span className="font-display text-xl font-800 tracking-tight">
                            <span className="text-[#E60000]">Main</span>
                            <span>Reviews</span>
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded brutal-btn bg-background text-foreground"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-4 py-3 font-display font-600 text-sm transition-all
                                    ${isActive
                                        ? 'bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#F5F0E8]'
                                        : 'text-foreground hover:bg-muted border-2 border-transparent hover:border-border'
                                    }
                                `}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom branding */}
                <div className="px-5 py-4" style={{ borderTop: '3px solid var(--border)' }}>
                    <p className="font-display font-700 text-xs text-muted-foreground uppercase tracking-widest">MainReviews</p>
                    <p className="text-xs text-muted-foreground mt-0.5">v1.0 · Bold Cinema</p>
                </div>
            </motion.aside>
        </>
    );
}

export function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { setMounted(true); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchExpanded(false);
            setSearchQuery('');
        }
    };

    return (
        <header
            className="fixed top-0 right-0 z-20 h-16 bg-background flex items-center justify-between px-4 lg:left-64 left-0"
            style={{ borderBottom: '3px solid var(--border)' }}
        >
            <div className="flex items-center gap-2">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuOpen}
                    className="lg:hidden brutal-btn p-2 bg-background text-foreground shrink-0"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                {/* Back to Home Button - Physical button for mobile usability */}
                <Link
                    href="/"
                    className="brutal-btn p-2 bg-[#FFE500] text-[#0A0A0A] shrink-0"
                    aria-label="Go to home"
                >
                    <Home size={20} />
                </Link>
            </div>

            {/* Mobile Search Toggle */}
            <button
                onClick={() => setSearchExpanded(true)}
                className={`md:hidden brutal-btn p-2 bg-background text-foreground ml-2 shrink-0 ${searchExpanded ? 'hidden' : 'flex'}`}
                aria-label="Open search"
            >
                <Search size={20} />
            </button>

            {/* Search bar - Desktop and Expanded Mobile */}
            <div className={`
                ${searchExpanded ? 'absolute inset-x-0 inset-y-0 z-30 flex items-center px-4 bg-background' : 'hidden md:flex md:flex-1 md:mx-4 md:max-w-sm'}
            `}>
                <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="search"
                            placeholder="Search movies..."
                            autoFocus={searchExpanded}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="brutal-input w-full pl-9 pr-4 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    {searchExpanded && (
                        <button
                            type="button"
                            onClick={() => setSearchExpanded(false)}
                            className="brutal-btn p-2 bg-background text-foreground shrink-0"
                            aria-label="Close search"
                        >
                            <X size={20} />
                        </button>
                    )}
                </form>
            </div>

            <div className={`flex items-center gap-2 ml-auto ${searchExpanded ? 'hidden' : 'flex'}`}>
                {/* Theme toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="brutal-btn p-2 bg-background text-foreground shrink-0"
                        aria-label="Toggle theme"
                    >
                        <motion.div
                            key={theme}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.div>
                    </button>
                )}

                {/* Profile dropdown */}
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="brutal-btn p-0.5 bg-background flex items-center gap-2 px-2 shrink-0">
                                <Avatar className="h-7 w-7" style={{ border: '2px solid var(--border)' }}>
                                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                    <AvatarFallback className="bg-[#E60000] text-white text-xs font-display font-700">
                                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <ChevronDown size={14} className="hidden sm:block" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52 brutal-card p-0" align="end">
                            <DropdownMenuLabel className="px-3 py-2 border-b-2 border-border">
                                <p className="font-display font-700 text-sm">{session.user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push('/account')} className="px-3 py-2 gap-2 cursor-pointer hover:bg-muted">
                                <Settings size={14} />
                                <span className="font-display font-600 text-sm">Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-border" />
                            <DropdownMenuItem onClick={() => signOut()} className="px-3 py-2 gap-2 cursor-pointer hover:bg-[#E60000] hover:text-white">
                                <LogOut size={14} />
                                <span className="font-display font-600 text-sm">Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link
                        href="/auth/login"
                        className="brutal-btn px-4 py-2 text-sm font-display font-700 bg-[#E60000] text-white border-border shrink-0"
                    >
                        <span className="hidden xs:inline">Sign In</span>
                        <User size={18} className="xs:hidden" />
                    </Link>
                )}
            </div>
        </header>
    );
}
