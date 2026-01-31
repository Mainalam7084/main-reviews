'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, LogOut, User, Menu } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-black/60">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-red-600">
                        MainReviews
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
                            Home
                        </Link>
                        <Link href="/reviews" className="text-sm font-medium text-gray-300 hover:text-white">
                            My Reviews
                        </Link>
                        <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
                            Movies
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                            if (query.trim()) {
                                router.push(`/search?q=${encodeURIComponent(query)}`);
                            }
                        }}>
                            <input
                                name="search"
                                type="search"
                                placeholder="Search titles..."
                                className="h-9 w-64 rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-4 text-sm text-gray-300 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                        </form>
                    </div>

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/account')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth/login">
                            <Button variant="default" className="bg-red-600 hover:bg-red-700 text-white">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
