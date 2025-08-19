'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Search, Command, Menu, X, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { categories, searchTools } from '@/lib/tools';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const searchResults = searchQuery.length > 0 ? searchTools(searchQuery) : [];

  const handleSearchSelect = (toolRoute: string) => {
    router.push(toolRoute);
    setSearchQuery('');
    setIsSearchFocused(false);
    searchRef.current?.blur();
  };

  // Theme toggle with animation
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header 
        className={cn(
          'sticky top-0 z-50 w-full bg-white/75 dark:bg-gray-900/75 backdrop-blur-md border-b border-gray-200/40 dark:border-gray-800/40 transition-all duration-300',
          isScrolled && 'shadow-lg bg-white/90 dark:bg-gray-900/90'
        )}
      >
        <div className="container max-w-7xl mx-auto flex h-16 items-center px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl animate-pulse">🐙</span>
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl">
                OctoTools
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium ml-8">
            <Link 
              href="/" 
              className={cn(
                'flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200',
                pathname === '/' && 'text-blue-600 dark:text-blue-400'
              )}
            >
              <Zap className="w-4 h-4 mr-1" />
              Tools
            </Link>
            <Link 
              href="/about" 
              className={cn(
                'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200',
                pathname === '/about' && 'text-blue-600 dark:text-blue-400'
              )}
            >
              About
            </Link>
            
            {/* Categories dropdown */}
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/40 dark:border-gray-800/40 rounded-xl p-4 shadow-xl">
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/?category=${category.id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span className="text-xl mr-3">{category.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{category.tools.length} tools</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className={cn(
                    'h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-12 text-sm transition-colors duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                    'md:w-[250px] lg:w-[350px]',
                    isSearchFocused && 'ring-2 ring-blue-500/20'
                  )}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden lg:inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded border">
                    <Command className="w-3 h-3 mr-1" />
                    K
                  </kbd>
                </div>
              </div>

              {/* Search Results */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/40 dark:border-gray-800/40 rounded-xl p-4 shadow-xl max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {searchResults.length} tool{searchResults.length === 1 ? '' : 's'} found
                        </div>
                        {searchResults.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleSearchSelect(tool.route)}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                          >
                            <span className="text-xl mr-3">{tool.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {tool.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No tools found for "{searchQuery}"</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🐙</span>
                <span className="font-bold">OctoTools</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span>Tools</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span>About</span>
              </Link>
              
              <div className="pt-4 border-t border-white/10">
                <div className="text-sm font-medium text-gray-400 mb-3">Categories</div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${category.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.tools.length} tools</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}