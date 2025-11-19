'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  FileText,
  Code,
  Eye,
  Columns2,
  Sun,
  Moon,
  Copy,
  Check,
  Upload,
  BarChart3,
} from 'lucide-react';
import { useToolStore } from '@/lib/store/toolStore';
import {
  parseMarkdown,
  calculateStats,
  exportToHTML,
  exportToPDF,
  downloadFile,
  templates,
  type TemplateName,
} from '@/lib/tools/markdown';
import { useHydration } from '@/lib/hooks/useHydration';
import { useScrollToResult } from '@/lib/hooks/useScrollToResult';

const STORAGE_KEY = 'markdown-preview-content';
const THEME_KEY = 'markdown-preview-theme';

type ViewMode = 'split' | 'editor' | 'preview';
type Theme = 'github-light' | 'github-dark';

export default function MarkdownPreview() {
  const isHydrated = useHydration();
  const { addToHistory } = useToolStore();
  const { resultRef, scrollToResult } = useScrollToResult({
    onlyIfNotVisible: false,
  });

  const [content, setContent] = useState('');
  const [html, setHtml] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [theme, setTheme] = useState<Theme>('github-light');
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [lastTrackedContent, setLastTrackedContent] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load saved content and theme on mount
  useEffect(() => {
    if (!isHydrated) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;

    if (saved) {
      setContent(saved);
    } else {
      // Set welcome template
      setContent(templates.readme);
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [isHydrated]);

  // Parse markdown to HTML
  useEffect(() => {
    if (!content.trim()) {
      setHtml('');
      return;
    }

    const result = parseMarkdown(content);
    if (result.success && result.html) {
      setHtml(result.html);
    }
  }, [content]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isHydrated || !content) return;

    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, content);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, isHydrated]);

  // Save theme preference
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, isHydrated]);

  // Track usage when user stops editing
  const trackUsage = () => {
    if (content.trim() && content !== lastTrackedContent && html) {
      const stats = calculateStats(content);
      addToHistory({
        id: crypto.randomUUID(),
        tool: 'markdown-preview',
        input: content,
        output: `${stats.words} words, ${stats.lines} lines`,
        timestamp: Date.now(),
      });
      setLastTrackedContent(content);
    }
  };

  const handleExportMarkdown = () => {
    trackUsage();
    const blob = new Blob([content], { type: 'text/markdown' });
    downloadFile(blob, 'document.md');
  };

  const handleExportHTML = () => {
    trackUsage();
    const result = exportToHTML(content, html, { theme });
    if (result.success && result.blob) {
      downloadFile(result.blob, 'document.html');
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    trackUsage();

    const result = await exportToPDF(previewRef.current);
    if (result.success && result.blob) {
      downloadFile(result.blob, 'document.pdf');
    }
  };

  const handleCopyHTML = async () => {
    trackUsage();
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
  };

  const handleLoadTemplate = (templateName: TemplateName) => {
    setContent(templates[templateName]);
  };

  const stats = content ? calculateStats(content) : null;

  const categoryColor = '#10b981'; // emerald-500 for text category

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {/* View Mode */}
              <div className="flex gap-1 rounded-lg border p-1">
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  style={{
                    backgroundColor:
                      viewMode === 'split' ? categoryColor : 'transparent',
                  }}
                >
                  <Columns2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('editor')}
                  style={{
                    backgroundColor:
                      viewMode === 'editor' ? categoryColor : 'transparent',
                  }}
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                  style={{
                    backgroundColor:
                      viewMode === 'preview' ? categoryColor : 'transparent',
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setTheme(
                    theme === 'github-light' ? 'github-dark' : 'github-light'
                  )
                }
              >
                {theme === 'github-light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              {/* Stats Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>

              {/* Import */}
              <div>
                <input
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleFileImport}
                  className="hidden"
                  id="markdown-file-input"
                />
                <label htmlFor="markdown-file-input">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() =>
                      document.getElementById('markdown-file-input')?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </label>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMarkdown}
                disabled={!content}
              >
                <Download className="mr-2 h-4 w-4" />
                MD
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportHTML}
                disabled={!content}
              >
                <Download className="mr-2 h-4 w-4" />
                HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={!content}
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyHTML}
                disabled={!content}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="mt-3 border-t pt-3">
            <p className="mb-2 text-sm text-muted-foreground">
              Quick Templates:
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(templates) as TemplateName[]).map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadTemplate(name)}
                  className="text-xs"
                >
                  {name.replace(/-/g, ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Panel */}
      {showStats && stats && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 lg:grid-cols-6">
              <div>
                <p className="text-muted-foreground">Words</p>
                <p className="font-semibold">{stats.words.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Characters</p>
                <p className="font-semibold">
                  {stats.characters.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Lines</p>
                <p className="font-semibold">{stats.lines.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reading Time</p>
                <p className="font-semibold">{stats.readingTime} min</p>
              </div>
              <div>
                <p className="text-muted-foreground">Headings</p>
                <p className="font-semibold">
                  {Object.values(stats.headings).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Links</p>
                <p className="font-semibold">{stats.links}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor and Preview */}
      <div
        ref={resultRef}
        className={`grid gap-4 ${
          viewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={trackUsage}
                placeholder="# Start writing your markdown here...

## Features
- GitHub Flavored Markdown
- Live preview
- Export to HTML/PDF
- Auto-save

Try typing some **bold** or *italic* text!"
                className="min-h-[600px] resize-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor:
                    theme === 'github-dark' ? '#0d1117' : '#ffffff',
                  color: theme === 'github-dark' ? '#e6edf3' : '#24292f',
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                ref={previewRef}
                className="prose prose-sm min-h-[600px] max-w-none overflow-auto p-6"
                style={{
                  backgroundColor:
                    theme === 'github-dark' ? '#0d1117' : '#ffffff',
                  color: theme === 'github-dark' ? '#e6edf3' : '#24292f',
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    html ||
                    '<p class="text-muted-foreground">Preview will appear here...</p>',
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Text */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Keyboard shortcuts:</strong>
            </p>
            <ul className="ml-2 list-inside list-disc space-y-1">
              <li>
                <kbd className="rounded bg-muted px-1.5 py-0.5">
                  Ctrl/Cmd + B
                </kbd>{' '}
                - Bold
              </li>
              <li>
                <kbd className="rounded bg-muted px-1.5 py-0.5">
                  Ctrl/Cmd + I
                </kbd>{' '}
                - Italic
              </li>
              <li>
                <kbd className="rounded bg-muted px-1.5 py-0.5">
                  Ctrl/Cmd + K
                </kbd>{' '}
                - Link
              </li>
            </ul>
            <p className="pt-2">
              <strong>Supports:</strong> GitHub Flavored Markdown (GFM), tables,
              task lists, code blocks, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
