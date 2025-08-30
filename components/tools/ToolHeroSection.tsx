'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { toolSEO, ToolSEO } from '@/lib/tool-seo';

interface ToolHeroSectionProps {
  toolId: string;
  toolName: string;
  categoryColor: string;
  categoryName?: string;
  favoriteButton?: React.ReactNode;
  categoryBadge?: React.ReactNode;
  className?: string;
}

export default function ToolHeroSection({
  toolId,
  toolName,
  categoryColor,
  categoryName,
  favoriteButton,
  categoryBadge,
  className = '',
}: ToolHeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const seoData = toolSEO[toolId];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fallback for tools without SEO data
  if (!seoData) {
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
        <h1
          className={`mb-2 text-3xl font-bold text-gray-900 transition-all delay-100 duration-500 dark:text-white sm:text-4xl lg:text-5xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {toolName}
        </h1>
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
    <div className={`mb-8 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Animated Icon */}
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 sm:h-20 sm:w-20 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            backgroundColor: `${categoryColor}20`,
            boxShadow: `0 10px 25px ${categoryColor}15`,
          }}
        >
          <Sparkles
            className="h-8 w-8 sm:h-10 sm:w-10"
            style={{ color: categoryColor }}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Tool Name (H1) with inline elements */}
          <div
            className={`mb-2 flex flex-wrap items-center gap-3 transition-all delay-100 duration-500 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {toolName}
            </h1>
            {favoriteButton && (
              <div className="flex items-center">{favoriteButton}</div>
            )}
            {categoryBadge && (
              <div className="flex items-center">{categoryBadge}</div>
            )}
          </div>

          {/* Tagline (Subtitle) */}
          <p
            className={`mb-4 text-lg text-gray-700 transition-all delay-150 duration-500 dark:text-gray-300 sm:text-xl ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            {seoData.tagline}
          </p>

          {/* SEO Description */}
          <p
            className={`max-w-4xl leading-relaxed text-gray-600 transition-all delay-200 duration-500 dark:text-gray-400 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            {seoData.seoDescription}
          </p>
        </div>
      </div>

      {/* Subtle Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}05 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
