import { cn } from '@/lib/utils';

type Verdict = 'NEVER_WATCH' | 'WATCH' | 'RECOMMEND' | 'STRONGLY_RECOMMEND' | 'BEST_EVER';

interface VerdictBadgeProps {
    verdict: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const verdictConfig: Record<string, { label: string; emoji: string; bg: string; text: string; border: string }> = {
    NEVER_WATCH: {
        label: 'Never Watch',
        emoji: '',
        bg: '#FF0000',
        text: '#FFFFFF',
        border: '#0A0A0A',
    },
    WATCH: {
        label: 'Watch',
        emoji: '',
        bg: '#0066FF',
        text: '#FFFFFF',
        border: '#0A0A0A',
    },
    RECOMMEND: {
        label: 'Recommend',
        emoji: '',
        bg: '#00F5A0',
        text: '#0A0A0A',
        border: '#0A0A0A',
    },
    STRONGLY_RECOMMEND: {
        label: 'Strongly Recommend',
        emoji: '',
        bg: '#E60000',
        text: '#FFFFFF',
        border: '#0A0A0A',
    },
    BEST_EVER: {
        label: 'Best Ever',
        emoji: '',
        bg: '#FFE500',
        text: '#0A0A0A',
        border: '#0A0A0A',
    },
};

const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
};

export function VerdictBadge({ verdict, className, size = 'sm' }: VerdictBadgeProps) {
    const config = verdictConfig[verdict] || {
        label: verdict,
        emoji: '•',
        bg: '#888888',
        text: '#FFFFFF',
        border: '#666666',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-display font-700 tracking-wide',
                sizeClasses[size],
                className
            )}
            style={{
                backgroundColor: config.bg,
                color: config.text,
                border: `2px solid ${config.border}`,
                boxShadow: `2px 2px 0px 0px ${config.border}`,
            }}
        >
            <span>{config.emoji}</span>
            <span>{config.label}</span>
        </span>
    );
}
