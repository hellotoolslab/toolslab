'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToolStore } from '@/lib/store/toolStore';
import { labToasts } from '@/lib/utils/toasts';
import { motion, AnimatePresence } from 'framer-motion';
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';
import { useHydration } from '@/lib/hooks/useHydration';

interface FavoriteButtonProps {
  type: 'tool' | 'category';
  id: string;
  name?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  type,
  id,
  name,
  className,
  showLabel = false,
  size = 'md',
}: FavoriteButtonProps) {
  const { isFavorite, toggleToolFavorite, toggleCategoryFavorite } =
    useToolStore();
  const { trackFavorite, trackEngagement } = useUmami();
  const isHydrated = useHydration();

  const isFav = isHydrated ? isFavorite(type, id) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasAdded = !isFav; // Stato prima del toggle

    if (type === 'tool') {
      // Controlla limite prima di aggiungere
      if (wasAdded) {
        const { favoriteTools } = useToolStore.getState();
        if (favoriteTools.length >= 50) {
          labToasts.labLimitReached('tools', 50);
          trackEngagement('lab-limit-reached', {
            type: 'tools',
            limit: 50,
            current_count: favoriteTools.length,
          });
          return;
        }
      }
      toggleToolFavorite(id);
    } else {
      // Controlla limite prima di aggiungere
      if (wasAdded) {
        const { favoriteCategories } = useToolStore.getState();
        if (favoriteCategories.length >= 10) {
          labToasts.labLimitReached('categories', 10);
          trackEngagement('lab-limit-reached', {
            type: 'categories',
            limit: 10,
            current_count: favoriteCategories.length,
          });
          return;
        }
      }
      toggleCategoryFavorite(id);
    }

    // Track the favorite action
    trackFavorite(type, id, wasAdded);

    // Show toast notification
    if (wasAdded) {
      labToasts.addToLab(name || id);
    } else {
      labToasts.removeFromLab(name || id);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'group relative inline-flex items-center gap-1.5 transition-all',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
        'cursor-pointer rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800',
        className
      )}
      title={isFav ? 'Remove from Lab' : 'Add to Lab'}
      aria-label={
        isFav ? `Remove ${name || id} from Lab` : `Add ${name || id} to Lab`
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFav ? 'filled' : 'empty'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors',
              isFav
                ? 'fill-amber-500 text-amber-500'
                : 'text-gray-400 hover:text-amber-500 group-hover:text-amber-500'
            )}
          />
        </motion.div>
      </AnimatePresence>

      {showLabel && (
        <span className="text-sm font-medium">
          {isFav ? 'In Lab' : 'Add to Lab'}
        </span>
      )}

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full" />
    </button>
  );
}
