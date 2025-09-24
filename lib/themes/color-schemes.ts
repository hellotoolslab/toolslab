export interface ColorScheme {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  colors: {
    // Background colors
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;

    // Primary colors
    primary: string;
    primaryForeground: string;

    // Secondary colors
    secondary: string;
    secondaryForeground: string;

    // Utility colors
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;

    // Border and input
    border: string;
    input: string;
    ring: string;

    // Additional for syntax highlighting in tools
    syntaxKeyword?: string;
    syntaxString?: string;
    syntaxNumber?: string;
    syntaxComment?: string;
  };
}

export const colorSchemes: Record<string, ColorScheme> = {
  light: {
    id: 'light',
    name: 'Light',
    icon: 'Sun',
    colors: {
      // Light theme colors (from current :root)
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      primary: '221.2 83.2% 53.3%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96%',
      secondaryForeground: '222.2 84% 4.9%',
      muted: '210 40% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '222.2 84% 4.9%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '221.2 83.2% 53.3%',
      // Syntax highlighting
      syntaxKeyword: '221.2 83.2% 53.3%',
      syntaxString: '142.1 76.2% 36.3%',
      syntaxNumber: '48.1 96.5% 53.1%',
      syntaxComment: '215.4 16.3% 46.9%',
    },
  },

  dark: {
    id: 'dark',
    name: 'Dark',
    icon: 'Moon',
    colors: {
      // Dark theme colors (from current .dark)
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      cardForeground: '210 40% 98%',
      popover: '222.2 84% 4.9%',
      popoverForeground: '210 40% 98%',
      primary: '217.2 91.2% 59.8%',
      primaryForeground: '222.2 84% 4.9%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '210 40% 98%',
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
      ring: '224.3 76.3% 94.1%',
      // Syntax highlighting
      syntaxKeyword: '217.2 91.2% 59.8%',
      syntaxString: '142.1 70.6% 45.3%',
      syntaxNumber: '48.1 95.5% 64.1%',
      syntaxComment: '215 20.2% 65.1%',
    },
  },

  sepia: {
    id: 'sepia',
    name: 'Sepia',
    icon: 'Coffee',
    colors: {
      // Warm sepia tones for reduced eye strain
      background: '39 31% 95%',
      foreground: '25 17% 25%',
      card: '39 25% 90%',
      cardForeground: '25 17% 25%',
      popover: '39 25% 90%',
      popoverForeground: '25 17% 25%',
      primary: '25 45% 45%',
      primaryForeground: '39 31% 95%',
      secondary: '30 20% 80%',
      secondaryForeground: '25 17% 25%',
      muted: '30 15% 85%',
      mutedForeground: '25 15% 40%',
      accent: '30 25% 82%',
      accentForeground: '25 17% 25%',
      destructive: '0 65% 51%',
      destructiveForeground: '39 31% 95%',
      border: '30 20% 80%',
      input: '30 20% 80%',
      ring: '25 45% 45%',
      // Syntax highlighting for sepia
      syntaxKeyword: '25 45% 45%',
      syntaxString: '120 25% 35%',
      syntaxNumber: '35 60% 45%',
      syntaxComment: '25 15% 55%',
    },
  },

  blue: {
    id: 'blue',
    name: 'Blue',
    icon: 'Waves',
    colors: {
      // Cool blue tones for focus and clarity
      background: '210 50% 98%',
      foreground: '210 40% 15%',
      card: '210 40% 96%',
      cardForeground: '210 40% 15%',
      popover: '210 40% 96%',
      popoverForeground: '210 40% 15%',
      primary: '210 70% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '210 30% 90%',
      secondaryForeground: '210 40% 15%',
      muted: '210 25% 92%',
      mutedForeground: '210 20% 40%',
      accent: '210 35% 88%',
      accentForeground: '210 40% 15%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 50% 98%',
      border: '210 30% 85%',
      input: '210 30% 85%',
      ring: '210 70% 50%',
      // Syntax highlighting for blue
      syntaxKeyword: '210 70% 50%',
      syntaxString: '142.1 76.2% 36.3%',
      syntaxNumber: '280 70% 55%',
      syntaxComment: '210 20% 55%',
    },
  },
};

export type ColorSchemeId = keyof typeof colorSchemes;

export const defaultColorScheme: ColorSchemeId = 'light';

// Utility function to get color scheme by ID
export function getColorScheme(id: ColorSchemeId): ColorScheme {
  return colorSchemes[id] || colorSchemes[defaultColorScheme];
}

// Utility function to get all available color schemes
export function getAllColorSchemes(): ColorScheme[] {
  return Object.values(colorSchemes);
}

// Utility function to get grouped color schemes for UI
export function getGroupedColorSchemes() {
  return {
    standard: [colorSchemes.light, colorSchemes.dark],
    colorful: [colorSchemes.sepia, colorSchemes.blue],
  };
}
