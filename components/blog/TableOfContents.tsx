'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOCItem } from '@/lib/blog/types';

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
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

    return () => {
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

  return (
    <nav
      className={cn(
        'sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto',
        'rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900',
        'transition-all duration-300',
        isCollapsed && 'lg:w-12'
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-4 flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 lg:hidden"
      >
        <span>Table of Contents</span>
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform',
            !isCollapsed && 'rotate-90'
          )}
        />
      </button>

      <div className="mb-4 hidden items-center justify-between lg:flex">
        <h3
          className={cn(
            'text-sm font-semibold text-gray-900 dark:text-gray-100',
            isCollapsed && 'hidden'
          )}
        >
          Table of Contents
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              !isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      <ul
        className={cn('space-y-2 text-sm', isCollapsed && 'hidden lg:hidden')}
      >
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
  );
}
