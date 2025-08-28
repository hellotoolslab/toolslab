'use client';

import { useState, useEffect } from 'react';
import {
  Copy,
  Download,
  Check,
  Loader2,
  ChevronRight,
  ChevronDown,
  FileJson,
  Minimize2,
  Maximize2,
  Eye,
  Code,
} from 'lucide-react';
import { useCopy } from '@/lib/hooks/useCopy';
import { useToolProcessor } from '@/lib/hooks/useToolProcessor';
import { useDownload } from '@/lib/hooks/useDownload';
import { BaseToolProps, JsonValue, JsonObject } from '@/lib/types/tools';
import { formatJSON, minifyJSON } from '@/lib/tools/json';

interface JsonFormatterProps extends BaseToolProps {}

export default function JsonFormatter({ categoryColor }: JsonFormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'formatted'>('formatted');
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  // Use unified hooks
  const { copied, copy } = useCopy();
  const { isProcessing, error, processSync } = useToolProcessor<
    string,
    string
  >();
  const { downloadJSON, downloadText } = useDownload();

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = processSync(input, (inputText) => {
        // Use the robust formatJSON function that handles Python-style syntax
        const formatResult = formatJSON(inputText);

        if (!formatResult.success) {
          throw new Error(formatResult.error || 'Failed to parse JSON');
        }

        const parsed = JSON.parse(formatResult.result || '{}');

        // Sort keys if enabled
        const processObject = (obj: JsonValue): JsonValue => {
          if (!sortKeys || typeof obj !== 'object' || obj === null) return obj;

          if (Array.isArray(obj)) {
            return obj.map(processObject);
          }

          const sorted: JsonObject = {};
          Object.keys(obj as JsonObject)
            .sort()
            .forEach((key) => {
              sorted[key] = processObject((obj as JsonObject)[key]);
            });
          return sorted;
        };

        const processed = sortKeys ? processObject(parsed) : parsed;
        return JSON.stringify(processed, null, indentSize);
      });

      setOutput(result);
    } catch (err) {
      // Error is handled by useToolProcessor
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = processSync(input, (inputText) => {
        // Use the robust minifyJSON function that handles Python-style syntax
        const minifyResult = minifyJSON(inputText);

        if (!minifyResult.success) {
          throw new Error(minifyResult.error || 'Failed to parse JSON');
        }

        return minifyResult.result || '';
      });

      setOutput(result);
    } catch (err) {
      // Error is handled by useToolProcessor
    }
  };

  const handleCopy = async () => {
    await copy(output);
  };

  const handleDownload = async () => {
    if (!output) return;

    try {
      // Try to download as JSON if valid, otherwise as text
      try {
        const parsed = JSON.parse(output);
        await downloadJSON(parsed, 'formatted.json');
      } catch {
        await downloadText(output, {
          filename: 'output.txt',
          mimeType: 'text/plain',
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const renderJsonTree = (data: JsonValue, depth = 0): JSX.Element => {
    if (data === null) return <span className="text-gray-500">null</span>;
    if (typeof data === 'boolean')
      return (
        <span className="text-purple-600 dark:text-purple-400">
          {String(data)}
        </span>
      );
    if (typeof data === 'number')
      return <span className="text-blue-600 dark:text-blue-400">{data}</span>;
    if (typeof data === 'string')
      return (
        <span className="text-green-600 dark:text-green-400">
          &ldquo;{data}&rdquo;
        </span>
      );

    if (Array.isArray(data)) {
      return (
        <details open={depth < 2} className="ml-4">
          <summary className="cursor-pointer rounded px-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="text-gray-500">Array[{data.length}]</span>
          </summary>
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-400">{index}:</span>
                {renderJsonTree(item, depth + 1)}
              </div>
            ))}
          </div>
        </details>
      );
    }

    if (typeof data === 'object') {
      const entries = Object.entries(data);
      return (
        <details open={depth < 2} className="ml-4">
          <summary className="cursor-pointer rounded px-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="text-gray-500">Object{`{${entries.length}}`}</span>
          </summary>
          <div className="ml-4">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">
                  &ldquo;{key}&rdquo;:
                </span>
                {renderJsonTree(value, depth + 1)}
              </div>
            ))}
          </div>
        </details>
      );
    }

    return <span>{String(data)}</span>;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FileJson className="h-5 w-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            JSON Formatter & Validator
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setViewMode(viewMode === 'tree' ? 'formatted' : 'tree')
            }
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={!output || error !== null}
          >
            {viewMode === 'tree' ? (
              <Code className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
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

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
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
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded"
              style={{ accentColor: categoryColor }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort keys
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={formatJson}
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
                Format
              </>
            )}
          </button>
          <button
            onClick={minifyJson}
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

        {/* Output Section */}
        {output && !error && (
          <div className="animate-slideIn space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
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

            {viewMode === 'formatted' ? (
              <pre
                className="h-48 w-full overflow-auto rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-white"
                style={{ borderColor: `${categoryColor}30` }}
              >
                <code className="language-json">{output}</code>
              </pre>
            ) : (
              <div
                className="h-48 w-full overflow-auto rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm dark:bg-gray-900"
                style={{ borderColor: `${categoryColor}30` }}
              >
                {(() => {
                  try {
                    return renderJsonTree(JSON.parse(output));
                  } catch {
                    return (
                      <div className="text-red-500">
                        Error rendering tree view. Please use formatted view.
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
