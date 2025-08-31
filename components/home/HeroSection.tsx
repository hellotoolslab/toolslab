'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchTools } from '@/lib/tools';
import { cn } from '@/lib/utils';

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

export function HeroSection() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [particles, setParticles] = useState<
    Array<{ left: string; top: string; delay: string; duration: string }>
  >([]);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${10 + Math.random() * 20}s`,
      }))
    );
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    const targetText = `Try '${placeholders[currentPlaceholder]}'...`;
    let currentIndex = 0;

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (currentIndex <= targetText.length) {
          setPlaceholderText(targetText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    } else {
      const erasingInterval = setInterval(() => {
        if (placeholderText.length > 0) {
          setPlaceholderText(placeholderText.slice(0, -1));
        } else {
          clearInterval(erasingInterval);
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
          setIsTyping(true);
        }
      }, 30);

      return () => clearInterval(erasingInterval);
    }
  }, [currentPlaceholder, isTyping, placeholderText]);

  const searchResults =
    searchQuery.length > 0 ? searchTools(searchQuery).slice(0, 5) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].route);
    }
  };

  const handleResultClick = (route: string) => {
    setIsSearchFocused(false);
    router.push(route);
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
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                Trusted by hundreds of developers worldwide
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Your Developer Tools{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Laboratory
            </span>{' '}
            <span className="inline-block animate-bounce text-5xl">🧪</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-white/90 sm:text-xl md:text-2xl">
            Experiment, Transform, Deploy.{' '}
            <span className="font-semibold">
              50+ precision-engineered tools
            </span>{' '}
            for your development workflow.{' '}
            <span className="text-yellow-300">
              No signup, no limits, just pure productivity.
            </span>
          </p>

          {/* Search bar */}
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="relative z-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  placeholder={placeholderText}
                  className="h-14 w-full rounded-2xl border border-white/20 bg-white/10 pl-12 pr-4 text-lg text-white placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-white/40 focus:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                  suppressHydrationWarning
                />
              </div>

              {/* Search suggestions dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[99999] mt-2 rounded-xl border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-md">
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
              <span className="text-sm text-white/70">Popular:</span>
              {popularSearches.map((search) => (
                <button
                  key={search.query}
                  onClick={() => handlePopularSearch(search.query)}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
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
