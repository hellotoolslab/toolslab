'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { searchTools } from '@/lib/tools';
import { useRouter } from 'next/navigation';

const placeholders = [
  'json formatter',
  'base64 encoder',
  'uuid generator',
  'url decoder',
  'hash generator',
  'timestamp converter',
];

export function HeroSection() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const searchResults =
    searchQuery.length > 0 ? searchTools(searchQuery).slice(0, 5) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].route);
    }
  };

  const handleResultClick = (route: string) => {
    router.push(route);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <section className="hero-section">
      <div className="hero-pattern" />

      <div className="container-main">
        <div className="hero-content">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 50k+ developers worldwide</span>
            </div>
          </div>

          <h1 className="hero-title">
            Developer Tools That{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Actually Work
            </span>
          </h1>

          <p className="hero-subtitle">
            No signup. No limits. No BS. Just powerful tools that solve real
            problems.
          </p>

          {/* Hero Search */}
          <div className="hero-search">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  placeholder={`Try "${placeholders[currentPlaceholder]}"`}
                  className="h-16 w-full rounded-2xl border border-white/20 bg-white/10 pl-16 pr-6 text-lg text-white placeholder-white/70 backdrop-blur-md transition-all duration-200 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />

                {/* Search button */}
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 transform cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100">
                  Search
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute left-0 right-0 top-full z-50 mt-4">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <div className="mb-3 text-xs text-white/70">
                          {searchResults.length} tool
                          {searchResults.length === 1 ? '' : 's'} found
                        </div>
                        {searchResults.map((tool) => (
                          <div
                            key={tool.id}
                            className="group flex w-full cursor-pointer items-center rounded-xl p-4 text-left transition-colors hover:bg-white/10"
                          >
                            <span className="mr-4 text-2xl">{tool.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-white transition-colors group-hover:text-yellow-300">
                                {tool.name}
                              </div>
                              <div className="line-clamp-1 text-sm text-white/70">
                                {tool.description}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-white/50 transition-colors group-hover:text-white/80" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-white/70">
                        <Search className="mx-auto mb-3 h-8 w-8 opacity-50" />
                        <div className="text-sm">
                          No tools found for &ldquo;{searchQuery}&rdquo;
                        </div>
                        <div className="mt-1 text-xs">
                          Try searching for &ldquo;json&rdquo;,
                          &ldquo;encode&rdquo;, or &ldquo;hash&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* Quick suggestions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-white/70">Popular:</span>
              {['JSON', 'Base64', 'UUID', 'Hash'].map((term) => (
                <div
                  key={term}
                  className="cursor-pointer rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20"
                >
                  {term}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
