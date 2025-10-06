'use client';

import { useState, useRef } from 'react';
import {
  Copy,
  Download,
  Check,
  Loader2,
  FileCode,
  Minimize2,
  Maximize2,
  Eye,
  Code,
  Search,
  CheckCircle,
  Info,
  AlertTriangle,
  TreePine,
  Settings,
} from 'lucide-react';
import { useCopy } from '@/lib/hooks/useCopy';
import { useToolProcessor } from '@/lib/hooks/useToolProcessor';
import { useDownload } from '@/lib/hooks/useDownload';
import { useToolTracking } from '@/lib/analytics/hooks/useToolTracking';
import { BaseToolProps } from '@/lib/types/tools';
import {
  formatXml,
  minifyXml,
  validateXml,
  parseXmlMetadata,
  searchXmlElements,
  XmlFormatterOptions,
} from '@/lib/tools/xml-formatter';

interface XmlFormatterProps extends BaseToolProps {}

export default function XmlFormatter({ categoryColor }: XmlFormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [viewMode, setViewMode] = useState<'formatted' | 'minified'>(
    'formatted'
  );
  const [indentSize, setIndentSize] = useState(2);
  const [sortAttributes, setSortAttributes] = useState(false);
  const [preserveComments, setPreserveComments] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedResults, setCopiedResults] = useState<Record<number, boolean>>(
    {}
  );
  const outputRef = useRef<HTMLDivElement>(null);

  // Use unified hooks
  const { copied, copy } = useCopy();
  const { isProcessing, error, processSync } = useToolProcessor<
    string,
    string
  >();
  const { downloadText } = useDownload();
  const { trackUse, trackCustom, trackError } =
    useToolTracking('xml-formatter');

  const formatXmlContent = () => {
    if (!input.trim()) {
      setOutput('');
      setValidationResults(null);
      setMetadata(null);
      return;
    }

    try {
      const options: XmlFormatterOptions = {
        indentSize,
        sortAttributes,
        preserveComments,
      };

      const result = processSync(input, (inputText) => {
        // First validate
        const validation = validateXml(inputText);
        setValidationResults(validation);

        // Parse metadata
        const xmlMetadata = parseXmlMetadata(inputText);
        setMetadata(xmlMetadata);

        // Format
        const formatResult = formatXml(inputText, options);
        if (!formatResult.success) {
          throw new Error(formatResult.error || 'Failed to format XML');
        }

        return formatResult.formatted || '';
      });

      setOutput(result);
      setViewMode('formatted');
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 3000);

      // Track successful formatting
      trackCustom({
        inputSize: input.length,
        outputSize: result.length,
        success: true,
        mode: 'format',
      });

      // Auto-scroll to output
      setTimeout(() => {
        outputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      // Track error
      trackError(
        err instanceof Error ? err : new Error(String(err)),
        input.length
      );
      // Error is handled by useToolProcessor
    }
  };

  const minifyXmlContent = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = processSync(input, (inputText) => {
        const minifyResult = minifyXml(inputText);
        if (!minifyResult.success) {
          throw new Error(minifyResult.error || 'Failed to minify XML');
        }
        return minifyResult.minified || '';
      });

      setOutput(result);
      setViewMode('minified');

      // Track successful minification
      trackCustom({
        inputSize: input.length,
        outputSize: result.length,
        success: true,
        mode: 'minify',
      });
    } catch (err) {
      // Track error
      trackError(
        err instanceof Error ? err : new Error(String(err)),
        input.length
      );
      // Error is handled by useToolProcessor
    }
  };

  const handleCopy = async () => {
    await copy(output);
  };

  const handleDownload = async () => {
    if (!output) return;

    const filename = viewMode === 'minified' ? 'minified.xml' : 'formatted.xml';
    await downloadText(output, {
      filename,
      mimeType: 'application/xml',
    });
  };

  const searchXml = () => {
    setHasSearched(true);
    setCopiedResults({});

    if (!output || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = searchXmlElements(output, searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  const handleCopySearchResult = async (result: any, index: number) => {
    const text = result.value || result.path || '';
    await navigator.clipboard.writeText(text);
    setCopiedResults({ ...copiedResults, [index]: true });
    setTimeout(() => {
      setCopiedResults((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FileCode className="h-5 w-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            XML Formatter & Validator
          </h3>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      <div className="space-y-6 p-6">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input XML
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <element attribute="value">content</element>\n</root>'
            className="h-48 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none dark:bg-gray-900 dark:text-white"
            style={{
              borderColor: error ? '#ef4444' : `${categoryColor}30`,
            }}
            onFocus={(e) => (e.target.style.borderColor = categoryColor)}
            onBlur={(e) =>
              (e.target.style.borderColor = error
                ? '#ef4444'
                : `${categoryColor}30`)
            }
          />
          {error && (
            <p className="animate-shake text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="animate-slideIn space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Formatting Options
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Indent:
                </label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={0}>Tab</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortAttributes}
                  onChange={(e) => setSortAttributes(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: categoryColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sort attributes
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={preserveComments}
                  onChange={(e) => setPreserveComments(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: categoryColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Preserve comments
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={formatXmlContent}
            disabled={!input || isProcessing}
            className="flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                Format & Validate
              </>
            )}
          </button>
          <button
            onClick={minifyXmlContent}
            disabled={!input || isProcessing}
            className="flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-medium transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
            }}
          >
            <Minimize2 className="h-4 w-4" />
            Minify
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Validation Results */}
        {validationResults && (
          <div className="animate-slideIn space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              {validationResults.valid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-700 dark:text-green-400">
                    XML is valid
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-700 dark:text-red-400">
                    XML has {validationResults.errors.length} error(s)
                  </span>
                </>
              )}
            </div>

            {!validationResults.valid &&
              validationResults.errors.length > 0 && (
                <div className="space-y-2">
                  {validationResults.errors.map((error: any, index: number) => (
                    <div
                      key={index}
                      className="rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    >
                      <div className="font-medium">Line {error.line}:</div>
                      <div>{error.message}</div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* XML Metadata */}
        {metadata && (
          <div className="animate-slideIn space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                XML Metadata
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <div className="text-gray-600 dark:text-gray-400">Elements</div>
                <div className="font-medium">{metadata.elementCount}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">
                  Attributes
                </div>
                <div className="font-medium">{metadata.attributeCount}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">
                  Max Depth
                </div>
                <div className="font-medium">{metadata.maxDepth}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">
                  Namespaces
                </div>
                <div className="font-medium">{metadata.namespaces.length}</div>
              </div>
            </div>

            {metadata.version && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Version:
                </span>{' '}
                <span className="font-medium">{metadata.version}</span>
                {metadata.encoding && (
                  <>
                    {' '}
                    |{' '}
                    <span className="text-gray-600 dark:text-gray-400">
                      Encoding:
                    </span>{' '}
                    <span className="font-medium">{metadata.encoding}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Success Indicator */}
        {formatSuccess && (
          <div className="animate-slideIn flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">XML processed successfully!</span>
          </div>
        )}

        {/* Output Section */}
        {output && !error && (
          <div className="animate-slideIn space-y-2" ref={outputRef}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output ({viewMode})
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>

            <pre
              className="min-h-96 w-full resize-y overflow-auto rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-white"
              style={{
                borderColor: formatSuccess ? '#10b981' : `${categoryColor}30`,
                height: '30rem',
              }}
            >
              <code className="language-xml">{output}</code>
            </pre>

            {/* XML Element Search Section */}
            <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search elements (e.g., 'user', '@id', '//user/@name')"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHasSearched(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchXml();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={searchXml}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                  style={{ backgroundColor: categoryColor }}
                >
                  Search
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Search tips: Use element names (e.g., &lsquo;title&rsquo;),
                attributes with @ (e.g., &lsquo;@id&rsquo;), or XPath-style
                queries (e.g., &lsquo;//user/@name&rsquo;)
              </div>

              {searchResults.length > 0 && (
                <div className="animate-slideIn space-y-3">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Found {searchResults.length} result
                    {searchResults.length > 1 ? 's' : ''}:
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg bg-white p-4 dark:bg-gray-800"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Value:
                          </span>
                          <button
                            onClick={() =>
                              handleCopySearchResult(result, index)
                            }
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {copiedResults[index] ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-sm dark:bg-gray-900">
                          <code className="break-all">
                            {result.value || 'N/A'}
                          </code>
                        </pre>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Path:
                        </span>
                        <code className="block overflow-x-auto whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-sm text-purple-600 dark:bg-gray-900 dark:text-purple-400">
                          {result.path}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hasSearched && searchQuery && searchResults.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No matches found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
