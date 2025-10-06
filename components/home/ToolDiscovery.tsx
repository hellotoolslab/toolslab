'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Database, Lock, Globe, Zap } from 'lucide-react';
import { tools } from '@/lib/tools';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';
import { useLocale } from '@/hooks/useLocale';

const useCaseTabsConfig = [
  {
    id: 'apiDev',
    icon: Code,
    tools: [
      'json-formatter',
      'jwt-decoder',
      'base64-encode',
      'url-encoder',
      'uuid-generator',
    ],
  },
  {
    id: 'dataProcessing',
    icon: Database,
    tools: [
      'json-formatter',
      'csv-to-json',
      'xml-to-json',
      'yaml-to-json',
      'sql-formatter',
    ],
  },
  {
    id: 'webDev',
    icon: Globe,
    tools: [
      'html-minifier',
      'css-minifier',
      'javascript-minifier',
      'color-converter',
      'markdown-to-html',
    ],
  },
  {
    id: 'security',
    icon: Lock,
    tools: [
      'hash-generator',
      'password-generator',
      'jwt-decoder',
      'base64-encode',
      'uuid-generator',
    ],
  },
  {
    id: 'productivity',
    icon: Zap,
    tools: [
      'unix-timestamp',
      'regex-tester',
      'diff-checker',
      'lorem-ipsum',
      'uuid-generator',
    ],
  },
];

export function ToolDiscovery() {
  const { data: t } = useDictionarySectionContext('home');
  const discovery = t?.toolDiscovery;
  const { createHref } = useLocale();
  const [activeTab, setActiveTab] = useState('apiDev');

  const activeUseCase = useCaseTabsConfig.find((tab) => tab.id === activeTab)!;
  const ActiveIcon = activeUseCase.icon;
  const activeTabData =
    discovery?.tabs?.[activeTab as keyof typeof discovery.tabs];

  const relevantTools = activeUseCase.tools
    .map((toolId) => tools.find((t) => t.id === toolId))
    .filter(Boolean)
    .slice(0, 5);

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {discovery?.title || 'Find Your Perfect Tool'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {discovery?.subtitle ||
              'Discover tools tailored to your specific use case'}
          </p>
        </div>

        {/* Tab navigation */}
        <div className="mt-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {useCaseTabsConfig.map((tab) => {
              const Icon = tab.icon;
              const tabData =
                discovery?.tabs?.[tab.id as keyof typeof discovery.tabs];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {tabData?.label || tab.id}
                  </span>
                  <span className="sm:hidden">
                    {tabData?.label?.split(' ')[0] || tab.id}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-lg bg-blue-600"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {/* Tab header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                    <ActiveIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeTabData?.label || activeUseCase.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeTabData?.description || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tools grid */}
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relevantTools.map((tool, index) => (
                    <motion.div
                      key={tool!.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={createHref(tool!.route)}
                        className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                      >
                        <div className="text-2xl">{tool!.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {tool!.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {tool!.description}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                            Try now
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Search suggestions */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">💡 Pro tip:</span> You can
                    chain these tools together for complex workflows. Try
                    formatting JSON, then encoding it to Base64 for API
                    transmission.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
