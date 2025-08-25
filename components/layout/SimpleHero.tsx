'use client';

import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { SearchBar, SearchBarRef } from '@/components/SearchBar';

export function SimpleHero() {
  const searchBarRef = useRef<SearchBarRef>(null);

  const handleQuickSearch = (term: string) => {
    searchBarRef.current?.setQuery(term);
  };

  return (
    <section className="relative bg-gradient-to-br from-lab-primary via-lab-secondary to-lab-primary py-20 lg:py-32">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center text-white">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by researchers worldwide</span>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
            Your Developer Tools{' '}
            <span className="bg-gradient-to-r from-lab-accent to-amber-400 bg-clip-text text-transparent">
              Laboratory
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90 lg:text-2xl">
            Experiment, Transform, Deploy. Precision-engineered tools for your
            development workflow.
          </p>

          {/* Hero Search */}
          <div className="mx-auto max-w-2xl">
            <SearchBar ref={searchBarRef} placeholder="Try 'json analyzer'" />

            {/* Quick suggestions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-white/70">Popular:</span>
              {['JSON', 'Base64', 'UUID', 'Hash'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="cursor-pointer rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
