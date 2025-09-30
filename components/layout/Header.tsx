'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, Zap, Beaker, Grid3X3, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { categories } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { LabLogo } from '@/components/icons/LabLogo';
import { useToolStore } from '@/lib/store/toolStore';
import { useHydration } from '@/lib/hooks/useHydration';
import { GitHubStars } from '@/components/ui/github-stars';
import { useLocale } from '@/hooks/useLocale';
import { useDictionarySection } from '@/hooks/useDictionary';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { getNewFavoritesCount } = useToolStore();
  const isStoreHydrated = useHydration();
  const { locale, createHref } = useLocale();
  const { data: nav } = useDictionarySection('common');

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
          'sticky top-0 z-50 w-full border-b border-gray-200/40 bg-white/75 backdrop-blur-md transition-all duration-300 dark:border-gray-800/40 dark:bg-gray-900/75',
          isScrolled && 'bg-white/90 shadow-lg dark:bg-gray-900/90'
        )}
      >
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href={createHref('/')}
              className="flex items-center space-x-3"
            >
              <LabLogo className="h-8 w-8 text-violet-600" animated />
              <span className="hidden bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:inline-block">
                ToolsLab
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="ml-8 hidden items-center space-x-8 text-sm font-medium md:flex">
            <Link
              href={createHref('/tools')}
              className={cn(
                'flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                pathname === createHref('/tools') &&
                  'text-violet-600 dark:text-violet-400'
              )}
            >
              <Zap className="mr-1 h-4 w-4" />
              {nav?.nav?.tools || 'Tools'}
            </Link>

            {/* Categories dropdown */}
            <div className="group relative">
              <button
                className="flex items-center rounded-lg px-2 py-1 text-gray-600 transition-colors duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100"
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Categories menu"
              >
                <Grid3X3 className="mr-1 h-4 w-4" />
                {nav?.nav?.categories || 'Categories'}
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-64 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div
                  className="rounded-xl border border-gray-200/40 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-gray-800/40 dark:bg-gray-900/95"
                  role="menu"
                  aria-label="Categories navigation menu"
                >
                  <div className="grid gap-2">
                    {/* Hub Link - Browse All Categories */}
                    <Link
                      href={createHref('/categories')}
                      className="flex items-center rounded-lg p-3 font-medium text-violet-600 transition-colors hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20"
                      role="menuitem"
                      aria-label="Browse all categories overview page"
                    >
                      <Grid3X3 className="mr-3 h-5 w-5" />
                      <div>
                        <div className="text-sm font-semibold">
                          Browse All Categories
                        </div>
                        <div className="text-xs text-violet-500 dark:text-violet-400">
                          Overview & comparison
                        </div>
                      </div>
                    </Link>

                    {/* Visual Separator */}
                    <div className="mx-2 my-1 border-t border-gray-200/60 dark:border-gray-700/60" />

                    {/* Individual Category Links */}
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={createHref(`/category/${category.id}`)}
                        className="flex items-center rounded-lg p-3 transition-colors hover:bg-white/10 dark:hover:bg-gray-800/50"
                        role="menuitem"
                        aria-label={`${category.name} category with ${category.tools.length} tools`}
                      >
                        <span className="mr-3 text-xl">{category.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {category.tools.length} tool
                            {category.tools.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={createHref('/lab')}
              className={cn(
                'flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                pathname === createHref('/lab') &&
                  'text-violet-600 dark:text-violet-400'
              )}
            >
              <Beaker className="mr-1 h-4 w-4" />
              {nav?.nav?.lab || 'The Lab'}
              {mounted && isStoreHydrated && getNewFavoritesCount() > 0 && (
                <span className="ml-1 rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                  {getNewFavoritesCount()}
                </span>
              )}
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="ml-auto flex items-center space-x-8 text-sm font-medium">
            {/* About Link */}
            <Link
              href={createHref('/about')}
              className={cn(
                'hidden items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 md:flex',
                pathname === createHref('/about') &&
                  'text-violet-600 dark:text-violet-400'
              )}
            >
              <Info className="mr-1 h-4 w-4" />
              {nav?.nav?.about || 'About'}
            </Link>

            {/* GitHub Stars */}
            <GitHubStars className="hidden sm:flex" />

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 md:hidden"
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
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 p-6 shadow-xl backdrop-blur-md dark:bg-gray-900/95">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LabLogo className="h-6 w-6 text-violet-600" animated />
                <span className="font-bold">ToolsLab</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4">
              <Link
                href={createHref('/tools')}
                className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Zap className="h-5 w-5" />
                <span>{nav?.nav?.tools || 'Tools'}</span>
              </Link>
              <Link
                href={createHref('/lab')}
                className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Beaker className="h-5 w-5" />
                <span>{nav?.nav?.lab || 'The Lab'}</span>
                {mounted && isStoreHydrated && getNewFavoritesCount() > 0 && (
                  <span className="ml-auto rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                    {getNewFavoritesCount()}
                  </span>
                )}
              </Link>
              <Link
                href={createHref('/about')}
                className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                <span>{nav?.nav?.about || 'About'}</span>
              </Link>

              <div className="border-t border-white/10 pt-4">
                <div className="mb-3 text-sm font-medium text-gray-400">
                  {nav?.nav?.categories || 'Categories'}
                </div>
                <div className="space-y-2">
                  {/* Hub Link - Browse All Categories */}
                  <Link
                    href={createHref('/categories')}
                    className="flex items-center space-x-3 rounded-lg p-3 font-medium text-violet-400 transition-colors hover:bg-violet-900/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Grid3X3 className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-semibold">
                        {nav?.nav?.categories || 'Browse All Categories'}
                      </div>
                      <div className="text-xs text-violet-400">
                        Overview & comparison
                      </div>
                    </div>
                  </Link>

                  {/* Visual Separator */}
                  <div className="mx-3 my-2 border-t border-white/10" />

                  {/* Individual Category Links */}
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={createHref(`/category/${category.id}`)}
                      className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <div className="text-sm font-medium">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.tools.length} tool
                          {category.tools.length !== 1 ? 's' : ''}
                        </div>
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
