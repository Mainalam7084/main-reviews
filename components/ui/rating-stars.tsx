'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 16, md: 24, lg: 32 };

export function RatingStars({ value, onChange, readonly = false, size = 'md' }: RatingStarsProps) {
    const [hovered, setHovered] = useState(0);
    const starSize = sizeMap[size];
    const activeValue = hovered || value;

    return (
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= activeValue;
                return (
                    <motion.button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        whileHover={readonly ? {} : { scale: 1.25, rotate: -5 }}
                        whileTap={readonly ? {} : { scale: 0.9, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`cursor-${readonly ? 'default' : 'pointer'} transition-colors`}
                        aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    >
                        <Star
                            size={starSize}
                            strokeWidth={2}
                            className={filled ? 'fill-[#FFE500] text-[#0A0A0A]' : 'fill-transparent text-muted-foreground'}
                            style={{ filter: filled ? 'drop-shadow(1px 1px 0px #0A0A0A)' : 'none' }}
                        />
                    </motion.button>
                );
            })}
            {!readonly && value > 0 && (
                <span className="font-display font-700 text-sm ml-1 text-foreground">{value}/5</span>
            )}
            {readonly && value > 0 && (
                <span className="font-display font-600 text-sm ml-1 text-muted-foreground">{value}/5</span>
            )}
        </div>
    );
}
