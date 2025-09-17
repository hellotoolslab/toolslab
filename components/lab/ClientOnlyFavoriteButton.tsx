'use client';

import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  type: 'tool' | 'category';
  id: string;
  name?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Static fallback component to prevent hydration mismatch
function FavoriteButtonFallback({
  className,
  size = 'md',
}: Pick<FavoriteButtonProps, 'className' | 'size'>) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-1.5 transition-all',
        'cursor-pointer rounded-full p-1',
        className
      )}
      aria-hidden="true"
    >
      <Star
        className={cn(sizeClasses[size], 'text-gray-400 transition-colors')}
      />
    </div>
  );
}

// Dynamically import the real FavoriteButton with no SSR
const DynamicFavoriteButton = dynamic(
  () =>
    import('./FavoriteButton').then((mod) => ({ default: mod.FavoriteButton })),
  {
    ssr: false,
    loading: () => <FavoriteButtonFallback size="md" />,
  }
);

export function ClientOnlyFavoriteButton(props: FavoriteButtonProps) {
  return <DynamicFavoriteButton {...props} />;
}
