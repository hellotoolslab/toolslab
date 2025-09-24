'use client';

import { useEffect, useState } from 'react';
import {
  ColorSchemeId,
  defaultColorScheme,
  getColorScheme,
} from '@/lib/themes/color-schemes';

const STORAGE_KEY = 'toolslab-color-scheme';

type SystemPreference = 'light' | 'dark';

function getSystemPreference(): SystemPreference {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredColorScheme(): ColorSchemeId | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored &&
      (stored === 'light' ||
        stored === 'dark' ||
        stored === 'sepia' ||
        stored === 'blue')
    ) {
      return stored as ColorSchemeId;
    }

    // Handle legacy theme storage (migration)
    const legacyTheme = localStorage.getItem('theme');
    if (legacyTheme === 'dark') {
      // Migrate legacy dark theme
      localStorage.setItem(STORAGE_KEY, 'dark');
      localStorage.removeItem('theme');
      return 'dark';
    } else if (legacyTheme === 'light') {
      // Migrate legacy light theme
      localStorage.setItem(STORAGE_KEY, 'light');
      localStorage.removeItem('theme');
      return 'light';
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  return null;
}

function setStoredColorScheme(colorScheme: ColorSchemeId): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, colorScheme);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

function applyColorScheme(colorSchemeId: ColorSchemeId): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Remove all existing color scheme classes
  root.classList.remove('light', 'dark', 'sepia', 'blue');

  // Always add the class for the current scheme
  root.classList.add(colorSchemeId);

  // Set a data attribute for easier debugging and CSS targeting
  root.setAttribute('data-color-scheme', colorSchemeId);
}

export function useColorScheme() {
  const [colorScheme, setColorSchemeState] =
    useState<ColorSchemeId>(defaultColorScheme);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize color scheme on mount
  useEffect(() => {
    const stored = getStoredColorScheme();
    const systemPreference = getSystemPreference();

    // Determine initial color scheme
    let initialColorScheme: ColorSchemeId;

    if (stored) {
      // Use stored preference
      initialColorScheme = stored;
    } else {
      // Use system preference for standard themes only
      initialColorScheme = systemPreference;
    }

    setColorSchemeState(initialColorScheme);
    applyColorScheme(initialColorScheme);
    setIsLoading(false);
  }, []);

  // Listen for system theme changes (only affects non-stored preferences)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = getStoredColorScheme();

      // Only apply system preference if no user preference is stored
      if (!stored) {
        const newScheme: ColorSchemeId = e.matches ? 'dark' : 'light';
        setColorSchemeState(newScheme);
        applyColorScheme(newScheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setColorScheme = (newColorScheme: ColorSchemeId) => {
    setColorSchemeState(newColorScheme);
    applyColorScheme(newColorScheme);
    setStoredColorScheme(newColorScheme);
  };

  const toggleColorScheme = () => {
    // Simple toggle between light and dark for backward compatibility
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
  };

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isLoading,
    colorSchemeData: getColorScheme(colorScheme),
  };
}

// Utility hook for components that need to check if a specific scheme is active
export function useIsColorScheme(targetScheme: ColorSchemeId): boolean {
  const { colorScheme } = useColorScheme();
  return colorScheme === targetScheme;
}

// Utility hook for getting color scheme CSS variables
export function useColorSchemeVariables() {
  const { colorSchemeData } = useColorScheme();

  return {
    background: `hsl(${colorSchemeData.colors.background})`,
    foreground: `hsl(${colorSchemeData.colors.foreground})`,
    primary: `hsl(${colorSchemeData.colors.primary})`,
    primaryForeground: `hsl(${colorSchemeData.colors.primaryForeground})`,
    // Add more as needed
  };
}
