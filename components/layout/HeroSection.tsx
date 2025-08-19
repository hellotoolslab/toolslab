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
  'timestamp converter'
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

  const searchResults = searchQuery.length > 0 ? searchTools(searchQuery).slice(0, 5) : [];

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
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
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
            No signup. No limits. No BS. Just powerful tools that solve real problems.
          </p>

          {/* Hero Search */}
          <div className="hero-search">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder={`Try "${placeholders[currentPlaceholder]}"`}
                  className="w-full h-16 pl-16 pr-6 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
                />
                
                {/* Search button */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
                  Search
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-4 z-50">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-white/70 mb-3">
                          {searchResults.length} tool{searchResults.length === 1 ? '' : 's'} found
                        </div>
                        {searchResults.map((tool) => (
                          <div
                            key={tool.id}
                            className="w-full flex items-center p-4 rounded-xl hover:bg-white/10 transition-colors text-left group cursor-pointer"
                          >
                            <span className="text-2xl mr-4">{tool.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-white group-hover:text-yellow-300 transition-colors">
                                {tool.name}
                              </div>
                              <div className="text-sm text-white/70 line-clamp-1">
                                {tool.description}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-white/70">
                        <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <div className="text-sm">No tools found for "{searchQuery}"</div>
                        <div className="text-xs mt-1">Try searching for "json", "encode", or "hash"</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="text-white/70 text-sm">Popular:</span>
              {['JSON', 'Base64', 'UUID', 'Hash'].map((term) => (
                <div
                  key={term}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white transition-all duration-200 hover:scale-105 cursor-pointer"
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