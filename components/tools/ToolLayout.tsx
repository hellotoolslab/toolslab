'use client';

import { Tool } from '@/lib/tools';
import { ArrowLeft, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useToolStore } from '@/lib/store/toolStore';
import { useEffect, useState } from 'react';

interface ToolLayoutProps {
  tool: Tool;
  children?: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { history, addToHistory, getUserLevel } = useToolStore();
  const [recentUses, setRecentUses] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<'first_time' | 'returning' | 'power'>('first_time');

  useEffect(() => {
    const toolHistory = history.filter(h => h.tool === tool.id);
    setRecentUses(toolHistory.length);
    setUserLevel(getUserLevel());
  }, [history, tool.id, getUserLevel]);

  const handleToolUse = (input: string, output: string) => {
    addToHistory({
      id: `${Date.now()}-${Math.random()}`,
      tool: tool.id,
      input,
      output,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to tools</span>
          </Link>
        </div>

        <div className="flex items-start space-x-6 mb-8">
          <div className="text-5xl" aria-hidden="true">
            {tool.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{tool.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{tool.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recentUses} uses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span className="capitalize">{userLevel.replace('_', ' ')} user</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {tool.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {children || (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              This tool is coming soon! We're working hard to bring you the best developer tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}