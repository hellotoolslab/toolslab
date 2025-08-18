import { Metadata } from 'next';
import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchTools } from '@/components/tools/SearchTools';

export const metadata: Metadata = {
  title: 'OctoTools - Essential Developer Tools',
  description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
  openGraph: {
    title: 'OctoTools - Essential Developer Tools',
    description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
    url: 'https://octotools.dev',
    siteName: 'OctoTools',
    type: 'website',
  },
};

export default function HomePage() {
  const sortedTools = [...tools].sort((a, b) => b.searchVolume - a.searchVolume);

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Essential Developer Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive collection of tools for encoding, formatting, converting, and generating.
          All tools work offline and respect your privacy.
        </p>
      </div>

      <SearchTools />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Built with ❤️ for developers</p>
          <p>All tools work offline • No data is sent to servers • Privacy first</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}