'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { searchTools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search tools...", className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchTools(query);
      setResults(searchResults.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          router.push(results[selectedIndex].route);
          setIsOpen(false);
          setQuery('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getCategoryColor = (categoryColor: string) => {
    const colors = {
      data: '#0EA5E9',
      encoding: '#10B981', 
      text: '#8B5CF6',
      generators: '#F97316',
      web: '#EC4899',
      dev: '#F59E0B'
    };
    return colors[categoryColor as keyof typeof colors] || '#3B82F6';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 
            rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
            transition-colors duration-200
          "
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="
          absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl
          max-h-96 overflow-y-auto
        ">
          <div className="p-2">
            {results.map((tool, index) => (
              <Link
                key={tool.id}
                href={tool.route}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`
                  block p-3 rounded-lg transition-colors duration-150
                  ${selectedIndex === index 
                    ? 'bg-blue-50 dark:bg-blue-900/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg border"
                    style={{ 
                      backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                      borderColor: `${getCategoryColor(tool.categoryColor)}40`
                    }}
                  >
                    <span>{tool.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                          color: getCategoryColor(tool.categoryColor)
                        }}
                      >
                        {tool.category}
                      </span>
                      {tool.isPopular && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          🔥 Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Search Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑</kbd> <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↓</kbd> to navigate, <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to select
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="
          absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl
        ">
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No tools found for "{query}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Try searching with different keywords
            </p>
          </div>
        </div>
      )}
    </div>
  );
}