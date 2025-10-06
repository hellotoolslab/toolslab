import { TOCItem } from './types';

export function generateTableOfContents(content: string): TOCItem[] {
  const tocItems: TOCItem[] = [];

  // Regular expression to match H2 and H3 headings in markdown
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();

    // Generate ID from text (slug format)
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    tocItems.push({
      id,
      text,
      level,
    });
  }

  return tocItems;
}

export function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
