'use client';

import Link, { type LinkProps } from 'next/link';
import { forwardRef, useMemo, type ComponentProps } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';

export interface LocalizedLinkProps
  extends Omit<ComponentProps<typeof Link>, 'href'>,
    Pick<LinkProps, 'replace' | 'scroll' | 'shallow' | 'prefetch'> {
  /**
   * The path to link to (without locale prefix)
   */
  href: string;

  /**
   * Target locale for the link
   * If not provided, uses current locale
   */
  locale?: Locale;

  /**
   * Whether to preserve query parameters when navigating
   * @default false
   */
  preserveQuery?: boolean;

  /**
   * Whether this is an external link
   * If true, href will be used as-is without localization
   * @default false
   */
  external?: boolean;
}

/**
 * Localized Link component that automatically handles locale prefixes
 *
 * Features:
 * - Auto-localization based on current or specified locale
 * - Query parameter preservation
 * - External link support
 * - Full Next.js Link compatibility
 * - Type-safe with proper forwarding
 *
 * @example
 * ```tsx
 * // Link with current locale
 * <LocalizedLink href="/tools">Tools</LocalizedLink>
 *
 * // Link with specific locale (useful for language switchers)
 * <LocalizedLink href="/tools" locale="it">Strumenti</LocalizedLink>
 *
 * // External link (no localization)
 * <LocalizedLink href="https://example.com" external>External</LocalizedLink>
 *
 * // Preserve query parameters
 * <LocalizedLink href="/tools" preserveQuery>Tools</LocalizedLink>
 * ```
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  (
    {
      href,
      locale,
      preserveQuery = false,
      external = false,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const { createLocalizedHref } = useLocalizedRouter();

    // Memoize the localized href to prevent unnecessary recalculations
    const localizedHref = useMemo(() => {
      // For external links, return href as-is
      if (external) {
        return href;
      }

      // Check if href is already an external URL
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return href;
      }

      // Get localized path
      let path = locale
        ? createLocalizedHref(href, locale)
        : createLocalizedHref(href);

      // Preserve query parameters if requested
      if (preserveQuery && typeof window !== 'undefined') {
        const search = window.location.search;
        if (search) {
          path += search;
        }
      }

      return path;
    }, [href, locale, preserveQuery, external, createLocalizedHref]);

    // Handle click events while preserving original onClick
    const handleClick = useMemo(() => {
      if (!onClick) return undefined;

      return (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick(event);
      };
    }, [onClick]);

    return (
      <Link
        ref={ref}
        href={localizedHref}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = 'LocalizedLink';

/**
 * Utility function to create localized href without rendering component
 * Useful for programmatic navigation or dynamic href generation
 */
export function createLocalizedHref(
  href: string,
  locale?: Locale,
  preserveQuery = false
): string {
  // This should be used within a component that has access to useLocalizedRouter
  // For now, we'll export it as a utility that can be used with the hook
  throw new Error(
    'createLocalizedHref utility should be used within a component. Use useLocalizedRouter hook instead.'
  );
}

export default LocalizedLink;
