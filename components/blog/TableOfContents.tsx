'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TOCItem } from '@/lib/blog/types';

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [tocPosition, setTocPosition] = useState({ left: 0, width: 288 });

  useEffect(() => {
    // Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -80% 0%',
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Calculate TOC position based on container
    const updateTocPosition = () => {
      if (typeof window === 'undefined') return;

      // Find the main container to calculate left position
      const container = document.querySelector('.max-w-7xl');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const padding = 32; // px-8 = 32px

        setTocPosition({
          left: Math.max(16, containerLeft + padding),
          width: window.innerWidth >= 1280 ? 320 : 288,
        });
      }
    };

    updateTocPosition();
    window.addEventListener('scroll', updateTocPosition);
    window.addEventListener('resize', updateTocPosition);

    return () => {
      window.removeEventListener('scroll', updateTocPosition);
      window.removeEventListener('resize', updateTocPosition);
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  // Always visible on desktop, hidden on mobile, follows scroll
  return (
    <>
      {/* Placeholder for layout */}
      <div className="hidden lg:block lg:w-72 xl:w-80" />

      {/* Fixed positioned TOC */}
      <nav
        className={cn(
          'fixed top-6 z-40 hidden max-h-[calc(100vh-4rem)] overflow-y-auto lg:block',
          'rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800'
        )}
        style={{
          left: `${tocPosition.left}px`,
          width: `${tocPosition.width}px`,
        }}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          📋 Table of Contents
        </h3>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn('transition-all', item.level === 3 && 'ml-4')}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'block rounded px-2 py-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                  activeId === item.id &&
                    'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
