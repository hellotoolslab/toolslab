'use client';

import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleImage } from './ArticleImage';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  publishDate: Date;
  readTime: string;
  category:
    | 'Tutorial'
    | 'Guide'
    | 'Comparison'
    | 'Best Practices'
    | 'Deep Dive';
  thumbnail?: string;
  relatedTools: string[];
  slug: string;
  isPillar?: boolean;
}

export function ArticleCard({
  title,
  excerpt,
  publishDate,
  readTime,
  category,
  thumbnail,
  relatedTools,
  slug,
  isPillar,
}: ArticleCardProps) {
  const categoryColors = {
    Tutorial: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Guide: 'bg-green-500/10 text-green-700 dark:text-green-400',
    Comparison: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'Best Practices': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    'Deep Dive': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  };

  return (
    <Link href={`/blog/${slug}`} className="block h-full">
      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-800/50">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <ArticleImage
            src={thumbnail}
            alt={title}
            title={title}
            category={category}
            className="h-full w-full"
            isPillar={isPillar}
          />
          {isPillar && (
            <Badge className="absolute right-2 top-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Pillar Content
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className={categoryColors[category]}>
              {category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>
          <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <time dateTime={publishDate.toISOString()}>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(publishDate)}
              </time>
            </div>
            {relatedTools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <Tag className="mr-1 h-3 w-3 text-muted-foreground" />
                {relatedTools.slice(0, 3).map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool.replace(/-/g, ' ')}
                  </Badge>
                ))}
                {relatedTools.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{relatedTools.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
