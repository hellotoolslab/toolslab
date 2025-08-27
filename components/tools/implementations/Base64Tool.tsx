'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Copy,
  Download,
  Check,
  Loader2,
  Upload,
  FileText,
  Image,
  Lock,
  Unlock,
  RefreshCw,
  Settings,
  X,
} from 'lucide-react';
import {
  processBase64Input,
  processFile,
  getFileExtensionFromMimeType,
  Base64Options,
  FileProcessResult,
} from '@/lib/tools/base64';
import { useCopy } from '@/lib/hooks/useCopy';
import { useDownload } from '@/lib/hooks/useDownload';

interface Base64ToolProps {
  categoryColor: string;
}

export default function Base64Tool({ categoryColor }: Base64ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { copied, copy } = useCopy();
  const { downloadText, downloadBase64AsBinary } = useDownload();
  const [fileInfo, setFileInfo] = useState<FileProcessResult | null>(null);
  const [operation, setOperation] = useState<'auto' | 'encode' | 'decode'>(
    'auto'
  );
  const [options, setOptions] = useState<Base64Options>({
    urlSafe: false,
    lineBreaks: false,
    lineLength: 76,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [detectedOperation, setDetectedOperation] = useState<
    'encode' | 'decode'
  >('encode');
  const [mimeType, setMimeType] = useState<string>('');
  const [isDataURL, setIsDataURL] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleProcess = useCallback(async () => {
    if (!input.trim()) {
      setOutput('');
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = processBase64Input(
        input,
        options,
        operation === 'auto' ? undefined : operation
      );

      setOutput(result.output);
      setSuggestions(result.suggestions || []);
      setDetectedOperation(result.operation);
      setMimeType(result.mimeType || '');
      setIsDataURL(result.isDataURL || false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setOutput('');
      setSuggestions([]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, options, operation]);

  // Auto-process when input changes and operation is auto
  useEffect(() => {
    if (input.trim() && operation === 'auto') {
      const timer = setTimeout(() => {
        handleProcess();
      }, 500); // Debounce
      return () => clearTimeout(timer);
    }
  }, [input, operation, handleProcess]);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processFile(file);
      setFileInfo(result);
      setInput(result.base64);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await copy(output);
  };

  const handleDownload = async () => {
    if (!output) return;

    try {
      const effectiveOp = getEffectiveOperation();
      if (effectiveOp === 'decode' && mimeType && !isDataURL) {
        // Download as binary file
        const extension = getFileExtensionFromMimeType(mimeType);
        const filename = `decoded.${extension}`;
        await downloadBase64AsBinary(output, filename, mimeType);
      } else if (effectiveOp === 'decode' && output.length < 1000000) {
        // Download decoded text
        await downloadText(output, {
          filename: 'decoded.txt',
          mimeType: 'text/plain',
        });
      } else {
        // Download Base64 text
        await downloadText(output, {
          filename: 'encoded.txt',
          mimeType: 'text/plain',
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setSuggestions([]);
    setFileInfo(null);
    setMimeType('');
    setIsDataURL(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertSample = (sample: string) => {
    setInput(sample);
  };

  // Calculate the actual operation that will be performed
  const getEffectiveOperation = (): 'encode' | 'decode' => {
    if (operation !== 'auto') {
      return operation;
    }
    return detectedOperation;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setOperation('auto')}
              className={`rounded px-3 py-1 text-xs ${operation === 'auto' ? 'text-white' : 'text-gray-600'}`}
              style={{
                backgroundColor:
                  operation === 'auto' ? categoryColor : 'transparent',
              }}
            >
              Auto
            </button>
            <button
              onClick={() => setOperation('encode')}
              className={`rounded px-3 py-1 text-xs ${operation === 'encode' ? 'text-white' : 'text-gray-600'}`}
              style={{
                backgroundColor:
                  operation === 'encode' ? categoryColor : 'transparent',
              }}
            >
              Encode
            </button>
            <button
              onClick={() => setOperation('decode')}
              className={`rounded px-3 py-1 text-xs ${operation === 'decode' ? 'text-white' : 'text-gray-600'}`}
              style={{
                backgroundColor:
                  operation === 'decode' ? categoryColor : 'transparent',
              }}
            >
              Decode
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {getEffectiveOperation() === 'encode'
              ? '📤 Encoding'
              : '📥 Decoding'}
          </div>

          {mimeType && (
            <div className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
              {mimeType}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
          </button>

          {fileInfo && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{fileInfo.fileName}</span>
              <span className="ml-2">
                ({Math.round(fileInfo.size / 1024)} KB)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Options Panel */}
        {showOptions && (
          <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Options
            </h4>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.urlSafe}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      urlSafe: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">URL Safe (- _ instead of + /)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.lineBreaks}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      lineBreaks: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Line breaks (MIME format)</span>
              </label>
            </div>
          </div>
        )}

        {/* Sample Data */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertSample('Hello World! 🌍')}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Sample Text
          </button>
          <button
            onClick={() =>
              insertSample(
                'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
              )
            }
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            JWT Payload
          </button>
          <button
            onClick={() =>
              insertSample(
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
              )
            }
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Data URL
          </button>
        </div>

        {/* File Upload Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group w-full rounded-lg border-2 border-dashed p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-900"
            style={{ borderColor: `${categoryColor}40` }}
          >
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-6 w-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <div className="text-center">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Drop file here or click to upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max file size: 10MB
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* File Info */}
        {fileInfo && fileInfo.dataURL && (
          <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5" />
              <div>
                <p className="font-medium">{fileInfo.fileName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fileInfo.mimeType} • {Math.round(fileInfo.size / 1024)}KB
                </p>
              </div>
              <img
                src={fileInfo.dataURL}
                alt="Preview"
                className="ml-auto h-12 w-12 rounded border object-cover"
              />
            </div>
          </div>
        )}

        {/* Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Input
            </label>
            <span className="text-xs text-gray-500">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or Base64 string to decode..."
            className="h-32 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none dark:bg-gray-900 dark:text-white"
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleProcess}
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
                {getEffectiveOperation() === 'encode' ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
                {getEffectiveOperation() === 'encode' ? 'Encode' : 'Decode'}
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
            }}
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:bg-blue-950/20">
            <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
              💡 Suggestions
            </h4>
            {suggestions.map((suggestion, index) => (
              <p
                key={index}
                className="text-sm text-blue-800 dark:text-blue-200"
              >
                • {suggestion}
              </p>
            ))}
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="animate-slideIn space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {output.length} characters
                </span>
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
            <textarea
              value={output}
              readOnly
              className="h-32 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-white"
              style={{ borderColor: `${categoryColor}30` }}
            />

            {/* Image Preview for decoded images */}
            {getEffectiveOperation() === 'decode' &&
              mimeType?.startsWith('image/') && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image Preview
                  </label>
                  <div className="mt-2 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
                    <img
                      src={`data:${mimeType};base64,${input.includes('base64,') ? input.split('base64,')[1] : input}`}
                      alt="Decoded image"
                      className="max-h-64 max-w-full rounded border object-contain"
                      onError={() =>
                        setError('Could not display the decoded image')
                      }
                    />
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Base64 encoding converts binary data into ASCII text format.
            It&apos;s commonly used for embedding images in HTML/CSS, encoding
            data for APIs, and handling binary data in text-based protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
