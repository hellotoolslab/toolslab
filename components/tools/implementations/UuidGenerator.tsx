'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Download, Zap, Hash } from 'lucide-react';
import { useMultiCopy } from '@/lib/hooks/useCopy';
import { useDownload } from '@/lib/hooks/useDownload';
import { BaseToolProps, UUIDVersion } from '@/lib/types/tools';

interface UuidGeneratorProps extends BaseToolProps {}

export default function UuidGenerator({ categoryColor }: UuidGeneratorProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

  // Use unified hooks
  const { copy, isCopied } = useMultiCopy<number | string>();
  const { downloadText } = useDownload();

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();

      if (!hyphens) {
        uuid = uuid.replace(/-/g, '');
      }

      if (uppercase) {
        uuid = uuid.toUpperCase();
      }

      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  const handleCopy = async (uuid: string, index: number) => {
    await copy(uuid, index);
  };

  const handleCopyAll = async () => {
    await copy(uuids.join('\n'), 'all');
  };

  const handleDownload = async () => {
    if (uuids.length === 0) return;

    try {
      await downloadText(uuids.join('\n'), {
        filename: 'uuids.txt',
        mimeType: 'text/plain',
        timestamp: true,
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            UUID Generator
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Universally Unique Identifier
        </span>
      </div>

      <div className="space-y-6 p-6">
        {/* Options */}
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Version
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as UUIDVersion)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Uppercase
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include hyphens
              </span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={generateUUID}
            className="flex items-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`,
            }}
          >
            <Zap className="h-4 w-4" />
            Generate UUID{count > 1 ? 's' : ''}
          </button>
        </div>

        {/* Results */}
        {uuids.length > 0 && (
          <div className="animate-slideIn space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated UUIDs ({uuids.length})
              </label>
              <div className="flex items-center gap-2">
                {uuids.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isCopied('all') ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">
                          All Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">Copy All</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={generateUUID}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Regenerate</span>
                </button>
              </div>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                  style={{
                    animation: `slideIn ${0.1 * (index + 1)}s ease-out`,
                    borderColor: isCopied(index) ? categoryColor : undefined,
                  }}
                >
                  <span className="w-8 text-xs text-gray-500 dark:text-gray-400">
                    {index + 1}.
                  </span>
                  <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white">
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopy(uuid, index)}
                    className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
                  >
                    {isCopied(index) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            UUIDs are 128-bit unique identifiers that are practically guaranteed
            to be unique across all systems and time.
          </p>
        </div>
      </div>
    </div>
  );
}
