'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BrutalCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: 'lift' | 'tilt' | 'none';
    shadowColor?: string;
}

export function BrutalCard({
    children,
    className,
    hoverEffect = 'lift',
    shadowColor = 'var(--foreground)',
}: BrutalCardProps) {
    const hoverVariants = {
        lift: { x: -3, y: -3 },
        tilt: { rotate: 1, x: -2, y: -2 },
        none: {},
    };

    return (
        <motion.div
            whileHover={hoverVariants[hoverEffect]}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                'bg-card text-card-foreground',
                className
            )}
            style={{
                border: '3px solid var(--border)',
                boxShadow: `5px 5px 0px 0px ${shadowColor}`,
            }}
        >
            {children}
        </motion.div>
    );
}

/* Static version for server components */
export function BrutalCardStatic({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn('bg-card text-card-foreground brutal-card', className)}
        >
            {children}
        </div>
    );
}
