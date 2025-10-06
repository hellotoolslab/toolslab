'use client';

import { useState } from 'react';

interface ArticleImageProps {
  src?: string;
  alt: string;
  title: string;
  category:
    | 'Tutorial'
    | 'Guide'
    | 'Comparison'
    | 'Best Practices'
    | 'Deep Dive';
  className?: string;
  isPillar?: boolean;
}

// Generate a deterministic color based on title
function getColorFromTitle(title: string): {
  primary: string;
  secondary: string;
  accent: string;
} {
  const colors = [
    {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'bg-blue-500/20',
      accent: 'text-blue-100',
    },
    {
      primary: 'from-green-500 to-teal-600',
      secondary: 'bg-green-500/20',
      accent: 'text-green-100',
    },
    {
      primary: 'from-purple-500 to-pink-600',
      secondary: 'bg-purple-500/20',
      accent: 'text-purple-100',
    },
    {
      primary: 'from-orange-500 to-red-600',
      secondary: 'bg-orange-500/20',
      accent: 'text-orange-100',
    },
    {
      primary: 'from-indigo-500 to-blue-600',
      secondary: 'bg-indigo-500/20',
      accent: 'text-indigo-100',
    },
    {
      primary: 'from-pink-500 to-rose-600',
      secondary: 'bg-pink-500/20',
      accent: 'text-pink-100',
    },
    {
      primary: 'from-emerald-500 to-green-600',
      secondary: 'bg-emerald-500/20',
      accent: 'text-emerald-100',
    },
    {
      primary: 'from-amber-500 to-orange-600',
      secondary: 'bg-amber-500/20',
      accent: 'text-amber-100',
    },
  ];

  const hash = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Get icon based on category
function getCategoryIcon(category: string): string {
  const icons = {
    Tutorial: '🎓',
    Guide: '📋',
    Comparison: '⚖️',
    'Best Practices': '⭐',
    'Deep Dive': '🔍',
  };
  return icons[category as keyof typeof icons] || '📝';
}

// Generate initials from title
function getTitleInitials(title: string): string {
  return title
    .split(' ')
    .filter((word) => word.length > 2) // Skip small words like "a", "an", "the"
    .slice(0, 2) // Take first 2 meaningful words
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function ArticleImage({
  src,
  alt,
  title,
  category,
  className = '',
  isPillar,
}: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const colors = getColorFromTitle(title);
  const icon = getCategoryIcon(category);
  const initials = getTitleInitials(title);

  // If no src provided or image failed to load, show generated placeholder
  if (!src || imageError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div
          className={`h-full w-full bg-gradient-to-br ${colors.primary} relative flex flex-col items-center justify-center p-4 text-center`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-4 top-4 h-8 w-8 rounded-full border-2 border-white"></div>
            <div className="absolute bottom-6 right-6 h-6 w-6 rounded border-2 border-white"></div>
            <div className="absolute right-8 top-1/3 h-4 w-4 rounded-full bg-white/30"></div>
            <div className="absolute bottom-1/3 left-8 h-5 w-5 rounded bg-white/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            <div className="mb-3 text-4xl drop-shadow-sm filter md:text-6xl">
              {icon}
            </div>

            <div
              className={`text-lg font-bold md:text-2xl ${colors.accent} mb-2 tracking-wider`}
            >
              {initials}
            </div>

            <div
              className={`text-xs md:text-sm ${colors.accent} rounded-full px-3 py-1 font-medium opacity-90 ${colors.secondary} backdrop-blur-sm`}
            >
              {category}
            </div>

            {isPillar && (
              <div className="absolute right-4 top-4 text-lg text-yellow-300 md:text-xl">
                ✨
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show actual image with loading state
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.primary} flex animate-pulse items-center justify-center`}
        >
          <div className="text-2xl md:text-4xl">{icon}</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
