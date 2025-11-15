'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface ToolHeroSectionProps {
  toolId: string;
  toolName: string;
  toolDescription?: string;
  toolTagline?: string;
  toolPageDescription?: string;
  categoryColor: string;
  categoryName?: string;
  favoriteButton?: React.ReactNode;
  categoryBadge?: React.ReactNode;
  labelBadge?: React.ReactNode;
  className?: string;
}

export default function ToolHeroSection({
  toolId,
  toolName,
  toolDescription,
  toolTagline,
  toolPageDescription,
  categoryColor,
  categoryName,
  favoriteButton,
  categoryBadge,
  labelBadge,
  className = '',
}: ToolHeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Use provided translations (from JSON granular files)
  const tagline = toolTagline || toolDescription;
  const pageDescription = toolPageDescription;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fallback for tools without SEO data
  if (!toolTagline && !toolPageDescription) {
    return (
      <div className={`mb-8 text-center ${className}`}>
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <Zap className="h-10 w-10" style={{ color: categoryColor }} />
        </div>
        <div
          className={`mb-2 text-3xl font-bold text-gray-900 transition-all delay-100 duration-500 dark:text-white sm:text-4xl lg:text-5xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          aria-level={1}
          role="heading"
        >
          {toolName}
        </div>
        <p
          className={`mb-4 text-xl text-gray-700 transition-all delay-150 duration-500 dark:text-gray-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Professional tool for developers and power users
        </p>
        <p
          className={`mx-auto max-w-3xl text-gray-600 transition-all delay-200 duration-500 dark:text-gray-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Streamline your workflow with this powerful development tool designed
          for efficiency and ease of use.
        </p>
      </div>
    );
  }

  return (
    <div className={`mb-3 md:mb-5 ${className}`}>
      {/* Inline header with icon, title, and badges */}
      <div className="mb-2 flex items-center gap-2 sm:gap-3">
        {/* Compact Icon */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-300 sm:h-14 sm:w-14 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            backgroundColor: `${categoryColor}20`,
          }}
        >
          <Sparkles
            className="h-6 w-6 sm:h-7 sm:w-7"
            style={{ color: categoryColor }}
          />
        </div>

        {/* Title and badges inline */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <div
            className={`text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-1 opacity-0'
            } transition-all delay-75 duration-300`}
            aria-level={1}
            role="heading"
          >
            {toolName}
          </div>
          {labelBadge && <div className="flex items-center">{labelBadge}</div>}
          {favoriteButton && (
            <div className="flex items-center">{favoriteButton}</div>
          )}
          {categoryBadge && (
            <div className="flex items-center">{categoryBadge}</div>
          )}
        </div>
      </div>

      {/* Tagline/Description - use translated version if available */}
      <p
        className={`mb-2 text-base text-gray-700 transition-all delay-100 duration-300 dark:text-gray-300 sm:text-lg md:mb-4 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {tagline}
      </p>

      {/* Page Description - hidden on mobile to show textarea */}
      {pageDescription && (
        <p
          className={`hidden max-w-4xl text-sm leading-relaxed text-gray-600 transition-all delay-150 duration-300 dark:text-gray-400 sm:text-base md:block ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
        >
          {pageDescription}
        </p>
      )}

      {/* Subtle Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}03 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
