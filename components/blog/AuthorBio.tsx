'use client';

import { Card, CardContent } from '@/components/ui/card';

interface AuthorBioProps {
  name: string;
  bio?: string;
  avatar?: string;
}

export function AuthorBio({ name, bio, avatar }: AuthorBioProps) {
  return (
    <Card className="mt-8">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <div
            className={
              avatar ? 'absolute inset-0 flex items-center justify-center' : ''
            }
          >
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          {bio && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {bio}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
