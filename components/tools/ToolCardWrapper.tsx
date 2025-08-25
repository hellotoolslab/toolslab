'use client';

import { ToolCard } from './ToolCard';
import { Tool } from '@/lib/tools';
import { useToolLabel } from '@/lib/services/toolLabelService';

interface ToolCardWrapperProps {
  tool: Tool;
  className?: string;
  showStats?: boolean;
}

export function ToolCardWrapper({
  tool,
  className,
  showStats,
}: ToolCardWrapperProps) {
  const toolLabel = useToolLabel(tool.id);

  return (
    <ToolCard
      tool={tool}
      className={className}
      showStats={showStats}
      toolLabel={toolLabel}
    />
  );
}
