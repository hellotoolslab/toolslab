import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  return (
    <Link href={tool.route} className="group">
      <div
        className={cn(
          'tool-card rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md transition-all duration-200',
          className
        )}
      >
        <div className="flex items-start space-x-4">
          <div className="text-3xl" aria-hidden="true">
            {tool.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {tool.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {tool.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}