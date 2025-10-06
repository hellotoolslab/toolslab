'use client';

import { useState, useEffect, useRef } from 'react';
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
  Search,
  CheckCircle,
  Upload,
  File,
  AlertCircle,
} from 'lucide-react';
import { useCopy } from '@/lib/hooks/useCopy';
import { useToolProcessor } from '@/lib/hooks/useToolProcessor';
import { useDownload } from '@/lib/hooks/useDownload';
import { useToolTracking } from '@/lib/analytics/hooks/useToolTracking';
import { BaseToolProps, JsonValue, JsonObject } from '@/lib/types/tools';
import { formatJSON, minifyJSON } from '@/lib/tools/json';

interface JsonFormatterProps extends BaseToolProps {}

export default function JsonFormatter({ categoryColor }: JsonFormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'formatted'>('formatted');
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ value: any; path: string }>
  >([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [copiedPaths, setCopiedPaths] = useState<Record<number, boolean>>({});
  const [copiedValues, setCopiedValues] = useState<Record<number, boolean>>({});
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  const [uploadedFileContent, setUploadedFileContent] = useState('');
  const [isLargeFile, setIsLargeFile] = useState(false);
  const [previewLines, setPreviewLines] = useState(0);
  const [fullFormattedOutput, setFullFormattedOutput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use unified hooks
  const { copied, copy } = useCopy();
  const { isProcessing, error, processSync } = useToolProcessor<
    string,
    string
  >();
  const { downloadJSON, downloadText } = useDownload();
  const { trackUse, trackError } = useToolTracking('json-formatter');

  const formatJson = () => {
    // Use uploaded file content if available, otherwise use manual input
    const contentToProcess = uploadedFileContent || input;

    if (!contentToProcess.trim()) {
      setOutput('');
      return;
    }

    // Estimate processing time for very large files
    const inputSizeMB = uploadedFileName
      ? uploadedFileSize / (1024 * 1024)
      : new Blob([contentToProcess]).size / (1024 * 1024);

    console.log('🔍 File size check:', {
      uploadedFileName,
      uploadedFileSize,
      uploadedFileContent: !!uploadedFileContent,
      uploadedFileSizeMB: uploadedFileSize / (1024 * 1024),
      inputSizeMB,
      contentLength: contentToProcess.length,
      isUploadedFile: !!uploadedFileName,
      calculatedSize: new Blob([contentToProcess]).size,
      calculatedSizeMB: new Blob([contentToProcess]).size / (1024 * 1024),
    });

    // Warn user about potentially long processing time for files > 50MB
    if (inputSizeMB > 50) {
      const confirmed = window.confirm(
        `⚠️ Very large file detected (${inputSizeMB.toFixed(1)} MB)\n\n` +
          `Processing may take several minutes and could use significant memory.\n` +
          `For files over 500MB, consider using a desktop JSON tool instead.\n\n` +
          `Continue processing?`
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      const result = processSync(contentToProcess, (inputText) => {
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

      // Store the full formatted output
      setFullFormattedOutput(result);

      // Check if we should limit preview (only for uploaded files > 5MB)
      const lines = result.split('\n');
      const totalLines = lines.length;
      const fileSizeMB = uploadedFileSize / (1024 * 1024); // Convert bytes to MB
      const shouldLimitPreview = Boolean(
        uploadedFileName && fileSizeMB > 5 && totalLines > 200
      );

      setIsLargeFile(shouldLimitPreview);
      setPreviewLines(totalLines);

      // If it's a large uploaded file, show only the first 200 lines in the preview
      if (shouldLimitPreview) {
        const preview = lines.slice(0, 200).join('\n');
        setOutput(preview);
      } else {
        setOutput(result);
      }

      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 3000);

      // Track successful formatting
      trackUse(contentToProcess, result, {
        success: true,
        processingTime: Date.now() - Date.now(), // processSync already measures this
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
        contentToProcess.length
      );
      // Error is handled by useToolProcessor
    }
  };

  const minifyJson = () => {
    // Use uploaded file content if available, otherwise use manual input
    const contentToProcess = uploadedFileContent || input;

    if (!contentToProcess.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = processSync(contentToProcess, (inputText) => {
        // Use the robust minifyJSON function that handles Python-style syntax
        const minifyResult = minifyJSON(inputText);

        if (!minifyResult.success) {
          throw new Error(minifyResult.error || 'Failed to parse JSON');
        }

        return minifyResult.result || '';
      });

      setOutput(result);

      // Track successful minification
      trackUse(contentToProcess, result, {
        success: true,
      });
    } catch (err) {
      // Track error
      trackError(
        err instanceof Error ? err : new Error(String(err)),
        contentToProcess.length
      );
      // Error is handled by useToolProcessor
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a JSON file
    if (
      !file.name.toLowerCase().endsWith('.json') &&
      file.type !== 'application/json'
    ) {
      setFormatSuccess(false);
      // Handle error through the error state if needed
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFileContent(content); // Store file content separately
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size); // Store file size in bytes

      // Auto-format the uploaded JSON
      setTimeout(() => {
        formatJson();
      }, 100);
    };
    reader.readAsText(file);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCopy = async () => {
    await copy(output);
    // Don't clear search results when copying output
  };

  const handleCopyPath = async (path: string, index: number) => {
    await navigator.clipboard.writeText(path);
    setCopiedPaths({ ...copiedPaths, [index]: true });
    setTimeout(() => {
      setCopiedPaths((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const handleCopyValue = async (value: any, index: number) => {
    const valueString =
      typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(valueString);
    setCopiedValues({ ...copiedValues, [index]: true });
    setTimeout(() => {
      setCopiedValues((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const handleDownload = async () => {
    if (!output) return;

    try {
      // Use full formatted output for large files, or regular output for smaller files
      const contentToDownload = fullFormattedOutput || output;
      const filename = uploadedFileName
        ? uploadedFileName.replace('.json', '_formatted.json')
        : 'formatted.json';

      // Try to download as JSON if valid, otherwise as text
      try {
        const parsed = JSON.parse(contentToDownload);
        await downloadJSON(parsed, filename);
      } catch {
        await downloadText(contentToDownload, {
          filename: filename.replace('.json', '.txt'),
          mimeType: 'text/plain',
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const searchJsonKey = () => {
    setHasSearched(true);
    setCopiedPaths({});
    setCopiedValues({});

    if (!output || !searchKey.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = JSON.parse(output);
      const results: Array<{ value: any; path: string }> = [];

      const findAllKeys = (
        obj: any,
        key: string,
        path: string[] = []
      ): void => {
        // Check if current object has the key
        if (
          obj &&
          typeof obj === 'object' &&
          !Array.isArray(obj) &&
          key in obj
        ) {
          results.push({
            value: obj[key],
            path: [...path, `['${key}']`].join(''),
          });
        }

        // Recursively search in nested objects
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              findAllKeys(obj[i], key, [...path, `[${i}]`]);
            }
          } else {
            for (const [k, v] of Object.entries(obj)) {
              if (k !== key) {
                // Don't go deeper for the same key we just found
                findAllKeys(v, key, [...path, `['${k}']`]);
              }
            }
          }
        }
      };

      findAllKeys(data, searchKey);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
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
      </div>

      <div className="relative space-y-6 p-6">
        {/* Processing Overlay */}
        {isProcessing && !uploadedFileName && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-300 bg-white/90 px-6 py-8 shadow-lg dark:border-gray-600 dark:bg-gray-900/90">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Processing JSON...
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Large JSON detected. This may take a moment.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Input JSON
            </label>
            <button
              onClick={handleFileUploadClick}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Upload className="h-4 w-4" />
              Upload JSON File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {uploadedFileName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <File className="h-4 w-4" />
              <span>Uploaded: {uploadedFileName}</span>
            </div>
          )}
          <div className="relative">
            <textarea
              value={uploadedFileName ? '' : input}
              onChange={(e) => {
                setInput(e.target.value);
                // Reset upload states when manually editing
                if (uploadedFileName) {
                  setUploadedFileName('');
                  setUploadedFileSize(0);
                  setUploadedFileContent('');
                  setIsLargeFile(false);
                }
              }}
              placeholder={
                uploadedFileName
                  ? ''
                  : '{"key": "value", "array": [1, 2, 3]} or upload a JSON file above'
              }
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
              disabled={!!uploadedFileName}
            />
            {uploadedFileName && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100/80 backdrop-blur-sm dark:bg-gray-800/80">
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white/90 px-4 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-900/90">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Processing: {uploadedFileName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB -
                          Please wait...
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Input file: {uploadedFileName}
                      </span>
                      <button
                        onClick={() => {
                          setUploadedFileName('');
                          setUploadedFileSize(0);
                          setUploadedFileContent('');
                          setInput('');
                          setOutput('');
                          setIsLargeFile(false);
                        }}
                        className="ml-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Remove file and clear input"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
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
            disabled={(!input && !uploadedFileName) || isProcessing}
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
            disabled={(!input && !uploadedFileName) || isProcessing}
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

        {/* Success Indicator */}
        {formatSuccess && (
          <div className="animate-slideIn flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">JSON formatted successfully!</span>
          </div>
        )}

        {/* Output Section */}
        {output && !error && (
          <div className="animate-slideIn space-y-2" ref={outputRef}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output{' '}
                {isLargeFile && (
                  <span className="text-gray-500">
                    (Preview - First 200 lines)
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setViewMode(viewMode === 'tree' ? 'formatted' : 'tree')
                  }
                  className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={`Switch to ${viewMode === 'tree' ? 'formatted' : 'tree'} view`}
                >
                  {viewMode === 'tree' ? (
                    <>
                      <Code className="h-4 w-4" />
                      <span className="text-sm">Code</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Tree</span>
                    </>
                  )}
                </button>
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
              <div className="relative">
                <pre
                  className="min-h-96 w-full resize-y overflow-auto rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-white"
                  style={{
                    borderColor: formatSuccess
                      ? '#10b981'
                      : `${categoryColor}30`,
                    height: '30rem',
                  }}
                >
                  <code className="language-json">{output}</code>
                </pre>
                {isLargeFile && (
                  <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                    <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Large file detected ({previewLines} lines total,{' '}
                        {(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                      Only the first 200 lines are shown above. Download the
                      complete formatted file using the button above to view the
                      full content.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="min-h-96 w-full resize-y overflow-auto rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm dark:bg-gray-900"
                style={{
                  borderColor: formatSuccess ? '#10b981' : `${categoryColor}30`,
                  height: '30rem',
                }}
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

            {/* JSON Key Search Section */}
            <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for a key in JSON..."
                  value={searchKey}
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setHasSearched(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchJsonKey();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={searchJsonKey}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                  style={{ backgroundColor: categoryColor }}
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="animate-slideIn space-y-3">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Found {searchResults.length} occurrence
                    {searchResults.length > 1 ? 's' : ''}:
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg bg-white p-4 dark:bg-gray-800"
                    >
                      {searchResults.length > 1 && (
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Occurrence {index + 1}
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Value:
                          </span>
                          <button
                            onClick={() => handleCopyValue(result.value, index)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {copiedValues[index] ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Value</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-sm dark:bg-gray-900">
                          <code className="break-all">
                            {JSON.stringify(result.value, null, 2)}
                          </code>
                        </pre>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Path:
                          </span>
                          <button
                            onClick={() => handleCopyPath(result.path, index)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {copiedPaths[index] ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Path</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="block overflow-x-auto whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-sm text-purple-600 dark:bg-gray-900 dark:text-purple-400">
                          {result.path}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hasSearched && searchKey && searchResults.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No key &ldquo;{searchKey}&rdquo; found in the JSON.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
