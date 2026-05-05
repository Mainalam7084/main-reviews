'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BrutalButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'mint' | 'dark';
type BrutalButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface BrutalButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: BrutalButtonVariant;
    size?: BrutalButtonSize;
    children?: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<BrutalButtonVariant, string> = {
    primary: 'bg-[#E60000] text-white border-foreground',
    secondary: 'bg-[#FFE500] text-[#0A0A0A] border-[#0A0A0A] dark:border-[#F5F0E8]',
    danger: 'bg-[#FF0000] text-white border-foreground',
    ghost: 'bg-transparent text-foreground border-foreground',
    mint: 'bg-[#00F5A0] text-[#0A0A0A] border-[#0A0A0A]',
    dark: 'bg-[#0A0A0A] text-[#F5F0E8] border-[#F5F0E8]',
};

const sizeClasses: Record<BrutalButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-10 py-4 text-lg',
};

export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        children,
        className,
        disabled,
        isLoading,
        fullWidth,
        ...props
    }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={disabled || isLoading ? {} : { x: -2, y: -2, boxShadow: '6px 6px 0px 0px var(--foreground)' }}
                whileTap={disabled || isLoading ? {} : { x: 2, y: 2, boxShadow: '0px 0px 0px 0px var(--foreground)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                disabled={disabled || isLoading}
                className={cn(
                    'brutal-btn font-display font-700 tracking-wide select-none',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth && 'w-full',
                    (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
                    className
                )}
                style={{ boxShadow: '4px 4px 0px 0px var(--foreground)' }}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {children}
                    </span>
                ) : children}
            </motion.button>
        );
    }
);

BrutalButton.displayName = 'BrutalButton';
