'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Check, Sparkles, Search } from 'lucide-react';
import Link from 'next/link';
import { formatJson } from '@/lib/tools/json-formatter';
import { useLocale } from '@/hooks/useLocale';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';

const sampleJson = `{"user":{"id":1,"name":"John Doe","email":"john@example.com","roles":["admin","user"],"settings":{"theme":"dark","notifications":true}}}`;

export function InteractiveDemo() {
  const { createHref } = useLocale();
  const { data: t } = useDictionarySectionContext('home');
  const demo = t?.interactiveDemo;
  const { data: commonT } = useDictionarySectionContext('common');

  const [isFormatted, setIsFormatted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ value: any; path: string }>
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  const formattedJson = formatJson(sampleJson).result || '';

  // Real key search function like in JsonFormatter
  const searchJsonKey = () => {
    setHasSearched(true);

    if (!formattedJson || !searchKey.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = JSON.parse(formattedJson);
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

  const handleFormat = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsFormatted(true);
      setIsAnimating(false);
    }, 500);
  };

  const handleReset = () => {
    setIsFormatted(false);
    setCopied(false);
    setSearchKey('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isFormatted ? formattedJson : sampleJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Interactive Demo
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {demo?.title || 'See It In Action'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {demo?.subtitle || 'Try our JSON formatter right here, right now'}
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                JSON Formatter Demo
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      {commonT?.messages?.copied || 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {demo?.copyButton || 'Copy'}
                    </>
                  )}
                </button>
                {isFormatted && (
                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
                <code className="text-gray-300">
                  <motion.div
                    animate={isAnimating ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isFormatted ? (
                      // Always show formatted JSON
                      <div className="space-y-1">
                        {formattedJson
                          .split('\n')
                          .map((line: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              {line}
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="break-all">{sampleJson}</div>
                    )}
                  </motion.div>
                </code>
              </pre>

              {/* Format button overlay */}
              {!isFormatted && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                  <motion.button
                    onClick={handleFormat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    <Sparkles className="h-5 w-5" />
                    {demo?.action || 'Format JSON'}
                  </motion.button>
                </div>
              )}
            </div>

            {/* Key Search Section */}
            {isFormatted && (
              <div className="mt-6 space-y-4">
                <div className="border-t border-gray-200 pt-4 dark:border-gray-600">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    🔍 Try Key Search
                  </h4>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <label htmlFor="demo-key-search" className="sr-only">
                        Search for JSON key
                      </label>
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id="demo-key-search"
                        type="text"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchJsonKey()}
                        placeholder="Search for key (e.g. 'user', 'name', 'settings')..."
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        suppressHydrationWarning
                      />
                    </div>
                    <button
                      onClick={searchJsonKey}
                      disabled={!searchKey.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {hasSearched && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                    {searchResults.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          Found {searchResults.length} result
                          {searchResults.length !== 1 ? 's' : ''}:
                        </div>
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-500 dark:bg-gray-700"
                          >
                            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Path:{' '}
                              <code className="rounded bg-gray-200 px-1 dark:bg-gray-600">
                                {result.path}
                              </code>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Value:{' '}
                              <code className="rounded bg-blue-100 px-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {typeof result.value === 'string'
                                  ? `"${result.value}"`
                                  : JSON.stringify(result.value)}
                              </code>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : searchKey.trim() ? (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="mb-2 text-2xl">🔍</div>
                        <div>
                          No results found for key &quot;{searchKey}&quot;
                        </div>
                        <div className="mt-2 text-xs">
                          Try searching for &quot;user&quot;, &quot;name&quot;,
                          or &quot;settings&quot;
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Success message */}
            {isFormatted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      JSON formatted successfully!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your JSON is now properly formatted and readable
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Like what you see? Try the full-featured JSON formatter
              </p>
              <Link
                href={createHref('/tools/json-formatter')}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {demo?.viewTool || 'Try Full JSON Formatter'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
