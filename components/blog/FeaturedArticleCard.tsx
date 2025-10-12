'use client';

import Link from 'next/link';
import { Calendar, Clock, Tag, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleImage } from './ArticleImage';

interface FeaturedArticleCardProps {
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
  locale?: string;
}

export function FeaturedArticleCard({
  title,
  excerpt,
  publishDate,
  readTime,
  category,
  thumbnail,
  relatedTools,
  slug,
  isPillar,
  locale = 'en',
}: FeaturedArticleCardProps) {
  const categoryColors = {
    Tutorial: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Guide: 'bg-green-500/10 text-green-700 dark:text-green-400',
    Comparison: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'Best Practices': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    'Deep Dive': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  };

  const blogUrl = locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return (
    <Link href={blogUrl} className="mb-12 block">
      <Card className="overflow-hidden border-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-purple-50 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-blue-800/50 dark:from-blue-950/20 dark:to-purple-950/20 dark:hover:shadow-gray-800/50">
        <CardContent className="p-0">
          <div className="grid gap-0 md:grid-cols-5">
            {/* Image Section */}
            <div className="relative md:col-span-2">
              <ArticleImage
                src={thumbnail}
                alt={title}
                title={title}
                category={category}
                className="h-full min-h-[200px] w-full md:min-h-[280px]"
                isPillar={isPillar}
              />

              {/* Featured Badge */}
              <div className="absolute left-4 top-4">
                <Badge className="border-0 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 text-sm font-medium text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              </div>

              {/* Pillar Badge */}
              {isPillar && (
                <div className="absolute right-4 top-4">
                  <Badge className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Pillar Content
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-8 md:col-span-3">
              {/* Category and Meta */}
              <div className="mb-4 flex items-center gap-4">
                <Badge variant="secondary" className={categoryColors[category]}>
                  {category}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={publishDate.toISOString()}>
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(publishDate)}
                    </time>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-4 line-clamp-2 text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
                {title}
              </h2>

              {/* Excerpt */}
              <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {excerpt}
              </p>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {relatedTools.slice(0, 4).map((tool) => (
                    <Badge
                      key={tool}
                      variant="outline"
                      className="bg-white/50 text-xs dark:bg-gray-800/50"
                    >
                      {tool.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                  {relatedTools.length > 4 && (
                    <Badge
                      variant="outline"
                      className="bg-white/50 text-xs dark:bg-gray-800/50"
                    >
                      +{relatedTools.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
