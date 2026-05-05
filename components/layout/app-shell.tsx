'use client';

import { useState } from 'react';
import { Sidebar, TopBar } from './sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Desktop sidebar spacer */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <TopBar onMenuOpen={() => setMobileOpen(true)} />

                {/* Main content area — padded below topbar */}
                <main className="pt-16 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
