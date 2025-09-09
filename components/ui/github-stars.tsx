'use client';

import { useState, useEffect } from 'react';
import { Star, Github } from 'lucide-react';

interface GitHubStarsProps {
  className?: string;
}

function formatStarCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function GitHubStars({ className = '' }: GitHubStarsProps) {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        // Check cache first
        const cached = sessionStorage.getItem('github-stars-cache');
        const cacheTime = sessionStorage.getItem('github-stars-cache-time');

        if (cached && cacheTime) {
          const hourAgo = Date.now() - 60 * 60 * 1000; // 1 hour in milliseconds
          if (parseInt(cacheTime) > hourAgo) {
            setStarCount(parseInt(cached));
            setIsLoaded(true);
            return;
          }
        }

        // Delay fetch to not block initial render
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await fetch(
          'https://api.github.com/repos/hellotoolslab/toolslab',
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('GitHub API error');
        }

        const data = await response.json();
        const stars = data.stargazers_count || 0;

        // Cache the result
        sessionStorage.setItem('github-stars-cache', stars.toString());
        sessionStorage.setItem(
          'github-stars-cache-time',
          Date.now().toString()
        );

        setStarCount(stars);
        setIsLoaded(true);
      } catch (error) {
        // Silently handle errors - just don't update the count
        setStarCount(0);
        setIsLoaded(true);
      }
    };

    fetchStars();
  }, []);

  const displayValue = starCount !== null ? formatStarCount(starCount) : '...';

  return (
    <a
      href="https://github.com/hellotoolslab/toolslab"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-2.5 py-1 text-sm font-medium tabular-nums backdrop-blur-sm transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-50/50 dark:hover:border-yellow-500 dark:hover:bg-yellow-950/20 ${className} `}
      style={{ minWidth: '78px' }}
    >
      <Github className="h-4 w-4 text-muted-foreground" />
      <Star
        className={`h-4 w-4 transition-colors duration-200 ${
          isLoaded ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
        }`}
      />
      <span className="text-foreground">{displayValue}</span>
    </a>
  );
}
