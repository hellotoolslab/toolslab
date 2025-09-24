'use client';

import { useColorScheme } from '@/lib/hooks/useColorScheme';
import { getAllColorSchemes, ColorSchemeId } from '@/lib/themes/color-schemes';
import { Sun, Moon, Coffee, Waves, Palette } from 'lucide-react';
import { useState } from 'react';

const iconMap = {
  Sun,
  Moon,
  Coffee,
  Waves,
} as const;

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme, isLoading } = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);
  const allSchemes = getAllColorSchemes();

  if (isLoading) {
    return (
      <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <Palette className="h-5 w-5 animate-pulse" />
      </div>
    );
  }

  const currentScheme = allSchemes.find((scheme) => scheme.id === colorScheme);
  const CurrentIcon = currentScheme
    ? iconMap[currentScheme.icon as keyof typeof iconMap]
    : Palette;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Select color scheme"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200/40 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-gray-800/40 dark:bg-gray-900/95">
            <div className="space-y-1">
              {allSchemes.map((scheme) => {
                const Icon = iconMap[scheme.icon as keyof typeof iconMap];
                const isSelected = colorScheme === scheme.id;

                return (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      setColorScheme(scheme.id as ColorSchemeId);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-sm font-medium">
                      {scheme.name}
                    </span>

                    {/* Color preview */}
                    <div className="flex space-x-1">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{
                          backgroundColor: `hsl(${scheme.colors.background})`,
                          borderColor: `hsl(${scheme.colors.border})`,
                        }}
                      />
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(${scheme.colors.primary})`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info */}
            <div className="mt-3 border-t border-gray-200 pt-2 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                Sepia reduces eye strain • Blue enhances focus
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
