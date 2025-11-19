import { marked } from 'marked';
import DOMPurify from 'dompurify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface MarkdownOptions {
  gfm?: boolean;
  breaks?: boolean;
  sanitize?: boolean;
  highlight?: boolean;
}

export interface ExportOptions {
  filename?: string;
  theme?: 'github-light' | 'github-dark';
  includeCSS?: boolean;
}

export interface MarkdownStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingTime: number; // in minutes
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  lists: number;
  codeBlocks: number;
  links: number;
  images: number;
  tables: number;
  blockquotes: number;
}

/**
 * Parse Markdown to HTML with sanitization
 */
export function parseMarkdown(
  content: string,
  options: MarkdownOptions = {}
): { success: boolean; html?: string; error?: string } {
  try {
    if (!content.trim()) {
      return { success: true, html: '' };
    }

    // Configure marked options
    marked.setOptions({
      gfm: options.gfm ?? true,
      breaks: options.breaks ?? true,
    });

    // Parse markdown
    const rawHtml = marked.parse(content) as string;

    // Sanitize if requested (default: true)
    const html =
      options.sanitize !== false
        ? DOMPurify.sanitize(rawHtml, {
            ADD_ATTR: ['target', 'rel'],
            ADD_TAGS: ['input'],
          })
        : rawHtml;

    return { success: true, html };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to parse markdown',
    };
  }
}

/**
 * Calculate comprehensive statistics for markdown content
 */
export function calculateStats(content: string): MarkdownStats {
  const lines = content.split('\n');
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim()).length;

  // Remove code blocks for word count
  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '');
  const words = contentWithoutCode
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;

  // Reading time: average 200 words per minute
  const readingTime = Math.ceil(words / 200);

  // Count headings
  const headings = {
    h1: (content.match(/^# /gm) || []).length,
    h2: (content.match(/^## /gm) || []).length,
    h3: (content.match(/^### /gm) || []).length,
    h4: (content.match(/^#### /gm) || []).length,
    h5: (content.match(/^##### /gm) || []).length,
    h6: (content.match(/^###### /gm) || []).length,
  };

  // Count lists (both ordered and unordered)
  const lists =
    (content.match(/^[\s]*[-*+]\s/gm) || []).length +
    (content.match(/^[\s]*\d+\.\s/gm) || []).length;

  // Count code blocks
  const codeBlocks = (content.match(/```/g) || []).length / 2;

  // Count links
  const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;

  // Count images
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // Count tables
  const tables =
    (content.match(/\|.*?\|/gm) || []).length > 0
      ? (content.match(/\n\|[-:\s|]+\|/g) || []).length
      : 0;

  // Count blockquotes
  const blockquotes = (content.match(/^>\s/gm) || []).length;

  return {
    characters,
    charactersNoSpaces,
    words,
    lines: lines.length,
    paragraphs,
    readingTime,
    headings,
    lists,
    codeBlocks,
    links,
    images,
    tables,
    blockquotes,
  };
}

/**
 * Export markdown as standalone HTML file
 */
export function exportToHTML(
  content: string,
  html: string,
  options: ExportOptions = {}
): { success: boolean; blob?: Blob; error?: string } {
  try {
    const theme = options.theme || 'github-light';
    const includeCSS = options.includeCSS ?? true;

    const css = includeCSS ? getThemeCSS(theme) : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="markdown-body">
    ${html}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    return { success: true, blob };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export HTML',
    };
  }
}

/**
 * Export preview as PDF
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const blob = pdf.output('blob');
    return { success: true, blob };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export PDF',
    };
  }
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get CSS for theme
 */
function getThemeCSS(theme: 'github-light' | 'github-dark'): string {
  const baseCSS = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    .markdown-body {
      max-width: 800px;
      margin: 0 auto;
    }
    .markdown-body h1,
    .markdown-body h2 {
      border-bottom: 1px solid #d0d7de;
      padding-bottom: 0.3em;
    }
    .markdown-body h1 {
      font-size: 2em;
      margin: 0.67em 0;
    }
    .markdown-body h2 {
      font-size: 1.5em;
      margin: 0.75em 0;
    }
    .markdown-body h3 {
      font-size: 1.25em;
      margin: 1em 0;
    }
    .markdown-body code {
      background-color: rgba(175, 184, 193, 0.2);
      padding: 0.2em 0.4em;
      border-radius: 6px;
      font-size: 85%;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    }
    .markdown-body pre {
      padding: 16px;
      overflow: auto;
      border-radius: 6px;
      background-color: #f6f8fa;
    }
    .markdown-body pre code {
      background-color: transparent;
      padding: 0;
    }
    .markdown-body blockquote {
      padding: 0 1em;
      border-left: 0.25em solid #d0d7de;
      margin: 0;
    }
    .markdown-body table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
    }
    .markdown-body table th,
    .markdown-body table td {
      padding: 6px 13px;
      border: 1px solid #d0d7de;
    }
    .markdown-body table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    .markdown-body img {
      max-width: 100%;
      height: auto;
    }
    .markdown-body a {
      color: #0969da;
      text-decoration: none;
    }
    .markdown-body a:hover {
      text-decoration: underline;
    }
  `;

  if (theme === 'github-dark') {
    return (
      baseCSS +
      `
      body {
        background-color: #0d1117;
        color: #e6edf3;
      }
      .markdown-body h1,
      .markdown-body h2 {
        border-bottom-color: #30363d;
      }
      .markdown-body code {
        background-color: rgba(110, 118, 129, 0.4);
      }
      .markdown-body pre {
        background-color: #161b22;
      }
      .markdown-body blockquote {
        border-left-color: #30363d;
        color: #8b949e;
      }
      .markdown-body table th,
      .markdown-body table td {
        border-color: #30363d;
      }
      .markdown-body table tr:nth-child(2n) {
        background-color: #161b22;
      }
      .markdown-body a {
        color: #58a6ff;
      }
    `
    );
  }

  return baseCSS;
}

/**
 * Template library
 */
export const templates = {
  readme: `# Project Name

## Description
A brief description of what this project does and who it's for.

## Installation
\`\`\`bash
npm install project-name
\`\`\`

## Usage
\`\`\`javascript
import { feature } from 'project-name';

// Example usage
feature.doSomething();
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License
`,
  'blog-post': `# Blog Post Title

*Published on ${new Date().toLocaleDateString()}*

## Introduction
Start with a compelling introduction that hooks the reader.

## Main Content
### Heading 1
Your main points here.

### Heading 2
More detailed information.

## Conclusion
Wrap up your thoughts and provide a clear takeaway.

---
*Tags: #tag1 #tag2 #tag3*
`,
  documentation: `# Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Examples](#examples)
- [FAQ](#faq)

## Getting Started
Introduction to your project.

## API Reference
### Function Name
\`\`\`javascript
functionName(param1, param2)
\`\`\`
- **param1**: Description
- **param2**: Description

## Examples
\`\`\`javascript
// Example code
\`\`\`

## FAQ
**Q: Question here?**
A: Answer here.
`,
  'meeting-notes': `# Meeting Notes - ${new Date().toLocaleDateString()}

## Attendees
- Name 1
- Name 2
- Name 3

## Agenda
1. Topic 1
2. Topic 2
3. Topic 3

## Discussion
### Topic 1
Notes here...

### Topic 2
Notes here...

## Action Items
- [ ] Task 1 - Assigned to: Name
- [ ] Task 2 - Assigned to: Name
- [ ] Task 3 - Assigned to: Name

## Next Meeting
Date: TBD
`,
  'task-list': `# Task List

## Today
- [ ] High priority task
- [ ] Important meeting at 2pm
- [ ] Code review

## This Week
- [ ] Complete feature X
- [ ] Write documentation
- [ ] Team presentation

## Backlog
- [ ] Refactor module Y
- [ ] Update dependencies
- [ ] Performance optimization
`,
  changelog: `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- New feature description

### Changed
- Changed feature description

### Fixed
- Bug fix description

## [1.0.0] - ${new Date().toLocaleDateString()}
### Added
- Initial release
`,
};

export type TemplateName = keyof typeof templates;
