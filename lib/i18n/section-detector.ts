import { type Locale } from './config';

/**
 * Dictionary sections available in the app
 */
export type DictionarySection =
  | 'common'
  | 'home'
  | 'tools'
  | 'categories'
  | 'footer'
  | 'lab'
  | 'about';

/**
 * Detect which dictionary section is needed based on pathname
 * This allows preloading the correct dictionary chunk
 */
export function detectSectionFromPathname(
  pathname: string
): DictionarySection[] {
  // Strip locale prefix if present
  const cleanPath = pathname.replace(/^\/(en|it)(\/|$)/, '/');

  // Common section is always needed (nav, actions, messages, labels)
  const sections: DictionarySection[] = ['common'];

  // Home page
  if (cleanPath === '/' || cleanPath === '') {
    sections.push('home', 'footer');
    return sections;
  }

  // Tools list page
  if (cleanPath === '/tools' || cleanPath === '/tools/') {
    sections.push('tools', 'categories', 'footer');
    return sections;
  }

  // Individual tool page
  if (cleanPath.startsWith('/tools/')) {
    sections.push('tools', 'footer');
    return sections;
  }

  // Categories page
  if (
    cleanPath === '/categories' ||
    cleanPath === '/categories/' ||
    cleanPath.startsWith('/category/')
  ) {
    sections.push('categories', 'tools', 'footer');
    return sections;
  }

  // Lab page
  if (cleanPath.startsWith('/lab')) {
    sections.push('tools', 'footer');
    return sections;
  }

  // About page
  if (cleanPath.startsWith('/about')) {
    sections.push('footer');
    return sections;
  }

  // Fallback: load common + footer
  sections.push('footer');
  return sections;
}

/**
 * Generate preload link header for dictionary sections
 */
export function generateDictionaryPreloadHeaders(
  locale: Locale,
  sections: DictionarySection[]
): string {
  return sections
    .map(
      (section) =>
        `</api/dictionary/${locale}?section=${section}>; rel=preload; as=fetch; crossorigin=anonymous`
    )
    .join(', ');
}

/**
 * Check if pathname requires locale-specific content
 */
export function shouldPreloadDictionary(pathname: string): boolean {
  // Skip for static assets and API routes (except dictionary API)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.webp')
  ) {
    return false;
  }

  return true;
}
