'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { tools, searchTools } from '@/lib/tools';
import { ToolCard } from './ToolCard';

export function SearchTools() {
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    return searchTools(query);
  }, [query]);

  const clearSearch = () => setQuery('');

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative mb-6">
        <label htmlFor="search-tools" className="sr-only">
          Search tools
        </label>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="search-tools"
          type="search"
          placeholder="Search tools by name, description, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-10 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length === 0
              ? `No tools found for "${query}"`
              : `${filteredTools.length} tool${filteredTools.length === 1 ? '' : 's'} found for "${query}"`}
          </p>

          {filteredTools.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
