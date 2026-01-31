'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchTools } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { type Locale, defaultLocale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { useLocale } from '@/hooks/useLocale';

const placeholders = [
  'json formatter',
  'base64 encoder',
  'jwt decoder',
  'uuid generator',
  'hash generator',
  'url encoder',
];

const popularSearches = [
  { label: 'JSON', query: 'json' },
  { label: 'Base64', query: 'base64' },
  { label: 'JWT', query: 'jwt' },
  { label: 'UUID', query: 'uuid' },
  { label: 'Hash', query: 'hash' },
  { label: 'URL Encode', query: 'url' },
];

interface HeroSectionProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export function HeroSection({
  locale = defaultLocale,
  dictionary,
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { createHref } = useLocale();

  // Get localized placeholders or fall back to English
  const localizedPlaceholders = useMemo(() => {
    if (!dictionary) return placeholders;

    return [
      dictionary.tools['json-formatter']?.title?.toLowerCase() ||
        'json formatter',
      dictionary.tools['base64-encode']?.title?.toLowerCase() ||
        'base64 encoder',
      dictionary.tools['jwt-decoder']?.title?.toLowerCase() || 'jwt decoder',
      dictionary.tools['uuid-generator']?.title?.toLowerCase() ||
        'uuid generator',
      dictionary.tools['hash-generator']?.title?.toLowerCase() ||
        'hash generator',
      dictionary.tools['url-encoder']?.title?.toLowerCase() || 'url encoder',
    ];
  }, [dictionary]);

  // Get localized popular searches
  const getPopularSearches = () => {
    if (!dictionary) return popularSearches;

    return [
      { label: 'JSON', query: 'json' },
      { label: 'Base64', query: 'base64' },
      { label: 'JWT', query: 'jwt' },
      { label: 'UUID', query: 'uuid' },
      { label: 'Hash', query: 'hash' },
      {
        label: dictionary.common?.actions?.encode || 'URL Encode',
        query: 'url',
      },
    ];
  };

  // Deterministic particles - no useEffect/setState needed
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        delay: `${(i * 1.3) % 10}s`,
        duration: `${10 + ((i * 2.7) % 20)}s`,
      })),
    []
  );

  // Typewriter effect via direct DOM manipulation - no re-renders
  useEffect(() => {
    const input = searchInputRef.current;
    if (!input) return;

    const tryText = dictionary?.common?.actions?.copy || 'Try';
    let currentPlaceholderIndex = 0;
    let currentIndex = 0;
    let timer: NodeJS.Timeout;
    let phase: 'typing' | 'pausing' | 'erasing' = 'typing';

    const getTargetText = () =>
      `${tryText} '${localizedPlaceholders[currentPlaceholderIndex]}'...`;

    const tick = () => {
      const targetText = getTargetText();
      if (phase === 'typing') {
        if (currentIndex <= targetText.length) {
          input.placeholder = targetText.slice(0, currentIndex);
          currentIndex++;
          timer = setTimeout(tick, 50);
        } else {
          phase = 'pausing';
          timer = setTimeout(tick, 2000);
        }
      } else if (phase === 'pausing') {
        phase = 'erasing';
        currentIndex = targetText.length;
        tick();
      } else if (phase === 'erasing') {
        if (currentIndex > 0) {
          currentIndex--;
          input.placeholder = targetText.slice(0, currentIndex);
          timer = setTimeout(tick, 30);
        } else {
          currentPlaceholderIndex =
            (currentPlaceholderIndex + 1) % localizedPlaceholders.length;
          phase = 'typing';
          timer = setTimeout(tick, 50);
        }
      }
    };

    tick();

    return () => clearTimeout(timer);
  }, [localizedPlaceholders, dictionary]);

  const searchResults =
    searchQuery.length > 0 ? searchTools(searchQuery).slice(0, 5) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(createHref(searchResults[0].route));
    }
  };

  const handleResultClick = (route: string) => {
    setIsSearchFocused(false);
    router.push(createHref(route));
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const results = searchTools(query);
    if (results.length > 0) {
      router.push(results[0].route);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-500/20" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Trust badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 md:backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                {dictionary?.home?.hero?.subtitle ||
                  'Trusted by hundreds of developers worldwide'}
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {dictionary?.home?.hero?.title || 'Your Developer Tools'}{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Laboratory
            </span>{' '}
            <span className="inline-block animate-bounce text-5xl">🧪</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-white/90 sm:text-xl md:text-2xl">
            {dictionary?.home?.hero?.description ||
              'Experiment, Transform, Deploy. 50+ precision-engineered tools for your development workflow. No signup, no limits, just pure productivity.'}
          </p>

          {/* Search bar */}
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <label htmlFor="hero-search" className="sr-only">
                  Search tools
                </label>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                <input
                  id="hero-search"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  placeholder=""
                  className="h-14 w-full rounded-2xl border border-white/20 bg-white/20 pl-12 pr-4 text-lg text-white placeholder-white/50 caret-transparent transition-all duration-200 focus:border-white/40 focus:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 md:bg-white/10 md:backdrop-blur-md"
                  suppressHydrationWarning
                />
              </div>

              {/* Search suggestions dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[99999] mt-2 rounded-xl border border-white/20 bg-white p-2 shadow-2xl md:bg-white/95 md:backdrop-blur-md">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleResultClick(tool.route)}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-blue-50"
                    >
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {tool.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {tool.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-white/70">
                {dictionary?.home?.popular?.subtitle || 'Popular'}:
              </span>
              {getPopularSearches().map((search) => (
                <button
                  key={search.query}
                  onClick={() => handlePopularSearch(search.query)}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/20 md:backdrop-blur-sm"
                >
                  {search.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(-5%) translateY(5%);
          }
          50% {
            transform: translateX(5%) translateY(-5%);
          }
          75% {
            transform: translateX(-5%) translateY(-5%);
          }
        }

        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }

        .particle {
          animation: float linear infinite;
        }

        @keyframes float {
          from {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          to {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
