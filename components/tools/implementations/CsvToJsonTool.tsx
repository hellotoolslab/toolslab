'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Copy,
  Download,
  Check,
  Upload,
  FileSpreadsheet,
  Settings,
  ArrowRight,
  AlertCircle,
  FileJson,
} from 'lucide-react';
import { useCopy } from '@/lib/hooks/useCopy';
import { useDownload } from '@/lib/hooks/useDownload';
import { useToolTracking } from '@/lib/analytics/hooks/useToolTracking';
import { BaseToolProps } from '@/lib/types/tools';
import {
  parseCsvToJson,
  detectDelimiter,
  validateCsv,
  getCsvStats,
  CsvToJsonOptions,
} from '@/lib/tools/csv-to-json';

interface CsvToJsonToolProps extends BaseToolProps {}

export default function CsvToJsonTool({ categoryColor }: CsvToJsonToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [autoDetectDelimiter, setAutoDetectDelimiter] = useState(true);
  const [detectedDelimiter, setDetectedDelimiter] = useState<string | null>(
    null
  );
  const [hasHeaders, setHasHeaders] = useState(true);
  const [detectTypes, setDetectTypes] = useState(false);
  const [trimValues, setTrimValues] = useState(true);
  const [outputFormat, setOutputFormat] = useState<
    'array' | 'nested' | 'compact'
  >('array');
  const [customHeaders, setCustomHeaders] = useState('');
  const [nullValues, setNullValues] = useState('NULL,N/A,null');
  const [minifyOutput, setMinifyOutput] = useState(false);
  const [stats, setStats] = useState<{ rows: number; columns: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { copied, copy } = useCopy();
  const { downloadJSON } = useDownload();
  const { trackUse, trackCustom, trackError } = useToolTracking('csv-to-json');

  // Auto-detect delimiter when input changes and auto-detect is enabled
  useEffect(() => {
    if (autoDetectDelimiter && input.trim()) {
      const detected = detectDelimiter(input);
      setDetectedDelimiter(detected);

      // Also update stats
      const csvStats = getCsvStats(input, detected);
      setStats({
        rows: csvStats.rows,
        columns: csvStats.columns,
      });
    } else if (!autoDetectDelimiter) {
      setDetectedDelimiter(null);
    }
  }, [input, autoDetectDelimiter]);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter CSV data');
      setStats(null);
      return;
    }

    try {
      setError(null);

      // Auto-detect delimiter if enabled
      let actualDelimiter = delimiter;
      if (autoDetectDelimiter) {
        actualDelimiter = detectDelimiter(input);
        setDetectedDelimiter(actualDelimiter);
      } else {
        setDetectedDelimiter(null);
      }

      // Parse custom headers
      const headers = customHeaders.trim()
        ? customHeaders.split(',').map((h) => h.trim())
        : [];

      // Parse null values
      const nullValuesList = nullValues.trim()
        ? nullValues.split(',').map((v) => v.trim())
        : [];

      const options: CsvToJsonOptions = {
        delimiter: actualDelimiter,
        hasHeaders,
        customHeaders: headers,
        detectTypes,
        trimValues,
        nullValues: nullValuesList,
        outputFormat,
      };

      const result = parseCsvToJson(input, options);

      if (!result.success) {
        setError(result.error || 'Failed to convert CSV');
        setOutput('');
        setStats(null);
        return;
      }

      // Format output
      const jsonString = minifyOutput
        ? JSON.stringify(result.data)
        : JSON.stringify(result.data, null, 2);

      setOutput(jsonString);
      setStats({
        rows: result.rowCount,
        columns: result.columnCount,
      });
      setConvertSuccess(true);
      setTimeout(() => setConvertSuccess(false), 3000);

      // Track successful conversion
      trackCustom({
        inputSize: input.length,
        outputSize: jsonString.length,
        success: true,
        rows: result.rowCount,
        columns: result.columnCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert CSV');
      setOutput('');
      setStats(null);

      // Track error
      trackError(
        err instanceof Error ? err : new Error(String(err)),
        input.length
      );
    }
  }, [
    input,
    delimiter,
    autoDetectDelimiter,
    hasHeaders,
    detectTypes,
    trimValues,
    customHeaders,
    nullValues,
    outputFormat,
    minifyOutput,
    trackUse,
    trackError,
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);

      // Auto-detect stats
      const csvStats = getCsvStats(content);
      if (autoDetectDelimiter) {
        const detected = csvStats.delimiter;
        setDetectedDelimiter(detected);
      }
      setHasHeaders(csvStats.hasHeaders);
    };
    reader.readAsText(file);
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setError('Please enter CSV data');
      return;
    }

    let actualDelimiter = delimiter;
    if (autoDetectDelimiter) {
      actualDelimiter = detectDelimiter(input);
      setDetectedDelimiter(actualDelimiter);
    }
    const validation = validateCsv(input, actualDelimiter);

    if (!validation.valid) {
      setError(validation.errors.join(', '));
    } else {
      setError(null);
      const csvStats = getCsvStats(input, actualDelimiter);
      setStats({
        rows: csvStats.rows,
        columns: csvStats.columns,
      });
    }
  };

  const handleCopy = async () => {
    await copy(output);
  };

  const handleDownload = () => {
    if (output) {
      downloadJSON(output, 'converted-data.json');
    }
  };

  const handleExampleData = () => {
    const example = `name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com
Alice Williams,28,Houston,alice@example.com`;
    setInput(example);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            CSV Input
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExampleData}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Load Example
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSV data here or upload a file..."
          className="min-h-[200px] w-full rounded-md border border-gray-300 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          spellCheck={false}
        />
      </div>

      {/* Options Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="font-medium">Conversion Options</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Delimiter */}
          <div>
            <label className="mb-1 block text-sm font-medium">Delimiter</label>
            <div className="flex gap-2">
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                disabled={autoDetectDelimiter}
                className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={autoDetectDelimiter}
                  onChange={(e) => setAutoDetectDelimiter(e.target.checked)}
                  className="rounded"
                />
                Auto
              </label>
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Output Format
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="array">Array of Objects</option>
              <option value="nested">Nested Object</option>
              <option value="compact">Compact Array</option>
            </select>
          </div>

          {/* Custom Headers */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Custom Headers
            </label>
            <input
              type="text"
              value={customHeaders}
              onChange={(e) => setCustomHeaders(e.target.value)}
              placeholder="col1,col2,col3"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={hasHeaders}
            />
          </div>

          {/* Null Values */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Null Values
            </label>
            <input
              type="text"
              value={nullValues}
              onChange={(e) => setNullValues(e.target.value)}
              placeholder="NULL,N/A,null"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasHeaders}
                onChange={(e) => setHasHeaders(e.target.checked)}
                className="rounded"
              />
              First row contains headers
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={detectTypes}
                onChange={(e) => setDetectTypes(e.target.checked)}
                className="rounded"
              />
              Auto-detect data types
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={trimValues}
                onChange={(e) => setTrimValues(e.target.checked)}
                className="rounded"
              />
              Trim whitespace
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={minifyOutput}
                onChange={(e) => setMinifyOutput(e.target.checked)}
                className="rounded"
              />
              Minify JSON output
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
            !input.trim()
              ? 'cursor-not-allowed bg-gray-400'
              : convertSuccess
                ? 'bg-green-600'
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {convertSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Converted!
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" />
              Convert to JSON
            </>
          )}
        </button>

        <button
          onClick={handleValidate}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Validate CSV
        </button>

        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
            setStats(null);
          }}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Display */}
      {stats && (
        <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Rows:</strong> {stats.rows}
          </span>
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Columns:</strong> {stats.columns}
          </span>
          {autoDetectDelimiter && detectedDelimiter && (
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Detected Delimiter:</strong>{' '}
              {detectedDelimiter === '\t'
                ? 'Tab'
                : detectedDelimiter === ','
                  ? 'Comma'
                  : detectedDelimiter === ';'
                    ? 'Semicolon'
                    : detectedDelimiter === '|'
                      ? 'Pipe'
                      : detectedDelimiter}
            </span>
          )}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                JSON Output
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/80"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/80"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <div className="relative">
            <pre className="max-h-96 overflow-auto rounded-md border border-gray-300 bg-gray-50 p-4 font-mono text-sm dark:border-gray-600 dark:bg-gray-700">
              <code className="text-gray-800 dark:text-gray-200">{output}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
