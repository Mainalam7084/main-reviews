'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
    Sun, Moon, User, LogOut, Settings, ChevronDown,
    Film, Star, Home, Info, Menu, X, Search,
    Tv, Users, Heart, Bookmark, ChevronRight,
    Zap, Laugh, Drama, Skull, Cpu, Heart as HeartIcon,
    Palette, FileText, Clapperboard,
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

// ─── Main nav links ───────────────────────────────────────────────────────────

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/tv', label: 'TV Series', icon: Tv },
    { href: '/people', label: 'People', icon: Users },
    { href: '/reviews', label: 'My Reviews', icon: Star },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/about', label: 'About', icon: Info },
];

// ─── Category tree data ───────────────────────────────────────────────────────

interface TreeChild {
    label: string;
    href: string;
    emoji?: string;
}

interface TreeNode {
    id: string;
    label: string;
    icon: React.ElementType;
    href?: string;
    accentColor: string;
    children?: TreeChild[];
}

const CATEGORY_TREE: TreeNode[] = [
    {
        id: 'movies',
        label: 'Movies',
        icon: Film,
        accentColor: '#E60000',
        children: [
            { label: 'Action', href: '/movies/category/action' },
            { label: 'Comedy', href: '/movies/category/comedy' },
            { label: 'Drama', href: '/movies/category/drama' },
            { label: 'Horror', href: '/movies/category/horror' },
            { label: 'Sci-Fi', href: '/movies/category/sci-fi' },
            { label: 'Animation', href: '/movies/category/animation' },
            { label: 'Romance', href: '/movies/category/romance' },
            { label: 'Documentary', href: '/movies/category/documentary' },
        ],
    },
    {
        id: 'tv',
        label: 'TV Series',
        icon: Tv,
        accentColor: '#0066FF',
        children: [
            { label: 'Drama', href: '/tv/category/drama', emoji: '🎭' },
            { label: 'Anime', href: '/tv/category/anime', emoji: '⛩️' },
            { label: 'Crime', href: '/tv/category/crime', emoji: '🔍' },
            { label: 'Comedy', href: '/tv/category/comedy', emoji: '😄' },
        ],
    },
    {
        id: 'people',
        label: 'People',
        icon: Users,
        accentColor: '#00F5A0',
        href: '/people',
        children: [
            { label: 'Popular Actors', href: '/people', emoji: '🌟' },
            { label: 'Directors', href: '/people', emoji: '🎬' },
        ],
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: Bookmark,
        accentColor: '#FFE500',
        children: [
            { label: 'Harry Potter', href: '/collections/1241', emoji: '⚡' },
            { label: 'John Wick', href: '/collections/404609', emoji: '🐕' },
            { label: 'Marvel', href: '/collections/131296', emoji: '🦸' },
            { label: 'Fast & Furious', href: '/collections/9485', emoji: '🏎️' },
        ],
    },
];

// ─── TreeSection component ────────────────────────────────────────────────────

function TreeSection({ node, onClose }: { node: TreeNode; onClose: () => void }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isActive = node.children
        ? node.children.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'))
        : pathname === node.href;

    return (
        <div>
            <button
                onClick={() => node.children ? setOpen((v) => !v) : undefined}
                className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-display font-700 uppercase tracking-widest transition-all
                    ${isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'}
                `}
            >
                <div className="flex items-center gap-2">
                    <node.icon size={13} strokeWidth={2.5} style={{ color: node.accentColor }} />
                    {node.label}
                </div>
                {node.children && (
                    <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight size={12} />
                    </motion.div>
                )}
            </button>

            <AnimatePresence initial={false}>
                {open && node.children && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="ml-4 border-l-2 pl-2 mb-1" style={{ borderColor: node.accentColor + '60' }}>
                            {node.children.map((child) => {
                                const childActive = pathname === child.href;
                                return (
                                    <Link
                                        key={child.href + child.label}
                                        href={child.href}
                                        onClick={onClose}
                                        className={`
                                            flex items-center gap-2 px-2 py-1.5 text-xs font-display font-600 transition-all rounded-sm
                                            ${childActive
                                                ? 'bg-[#FFE500] text-[#0A0A0A] border border-[#0A0A0A]'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                                        `}
                                    >
                                        {child.emoji && <span className="text-base leading-none">{child.emoji}</span>}
                                        {child.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

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
                className="fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-background lg:translate-x-0 lg:![transform:none] lg:z-30"
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

                {/* Scrollable nav area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Main nav links */}
                    <nav className="px-3 py-3 space-y-0.5">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 font-display font-600 text-sm transition-all
                                        ${isActive
                                            ? 'bg-[#FFE500] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#F5F0E8]'
                                            : 'text-foreground hover:bg-muted border-2 border-transparent hover:border-border'}
                                    `}
                                >
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                    {label}
                                    {label === 'Favorites' && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-[#E60000]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Category Tree divider */}
                    <div className="mx-4 my-2" style={{ borderTop: '2px solid var(--border)' }} />

                    {/* Category tree label */}
                    <div className="px-5 py-1">
                        <p className="font-display font-800 text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                            Browse Categories
                        </p>
                    </div>

                    {/* Category Tree */}
                    <div className="px-3 pb-3 space-y-0.5">
                        {CATEGORY_TREE.map((node) => (
                            <TreeSection key={node.id} node={node} onClose={onClose} />
                        ))}
                    </div>
                </div>

                {/* Bottom branding */}
                <div className="px-5 py-3 shrink-0" style={{ borderTop: '3px solid var(--border)' }}>
                    <p className="font-display font-700 text-xs text-muted-foreground uppercase tracking-widest">MainReviews</p>
                    <p className="text-xs text-muted-foreground mt-0.5">v1.0 · Bold Cinema</p>
                </div>
            </motion.aside>
        </>
    );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

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

                {/* Back to Home */}
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

            {/* Search bar */}
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
                            <DropdownMenuItem onClick={() => router.push('/favorites')} className="px-3 py-2 gap-2 cursor-pointer hover:bg-muted">
                                <Heart size={14} />
                                <span className="font-display font-600 text-sm">Favorites</span>
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
