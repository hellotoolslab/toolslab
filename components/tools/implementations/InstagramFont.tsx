'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Check,
  Star,
  Search,
  Instagram,
  MessageCircle,
  Twitter,
  Facebook,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCopy } from '@/lib/hooks/useCopy';
import { useToolTracking } from '@/lib/analytics/hooks/useToolTracking';
import { BaseToolProps } from '@/lib/types/tools';
import {
  generateInstagramFonts,
  fontStyles,
  type FontStyle,
} from '@/lib/tools/instagram-font';
import { useToolStore } from '@/lib/store/toolStore';
import { useHydration } from '@/lib/hooks/useHydration';

interface InstagramFontProps extends BaseToolProps {}

const MAX_CHARS_BIO = 150; // Instagram bio character limit
const MAX_CHARS_POST = 2200; // Instagram post character limit

export default function InstagramFont({ categoryColor }: InstagramFontProps) {
  const [input, setInput] = useState('');
  const [generatedStyles, setGeneratedStyles] = useState<
    Array<{
      id: string;
      name: string;
      text: string;
      compatibility: FontStyle['compatibility'];
    }>
  >([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedStyleId, setCopiedStyleId] = useState<string | null>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const isHydrated = useHydration();
  const { addToHistory, favoriteTools } = useToolStore();
  const safeFavorites = isHydrated ? favoriteTools : [];
  const isFavorite = safeFavorites.includes('instagram-font-generator');

  const { trackUse, trackCustom } = useToolTracking('instagram-font-generator');
  const { copied: copiedAll, copy: copyAll } = useCopy();

  // Local storage for favorites
  const [localFavoriteStyles, setLocalFavoriteStyles] = useState<string[]>([]);

  useEffect(() => {
    if (isHydrated) {
      const saved = localStorage.getItem('instagram-font-favorites');
      if (saved) {
        try {
          setLocalFavoriteStyles(JSON.parse(saved));
        } catch {}
      }
    }
  }, [isHydrated]);

  const toggleFavoriteStyle = (styleId: string) => {
    const newFavorites = localFavoriteStyles.includes(styleId)
      ? localFavoriteStyles.filter((id) => id !== styleId)
      : [...localFavoriteStyles, styleId];

    setLocalFavoriteStyles(newFavorites);
    if (isHydrated) {
      localStorage.setItem(
        'instagram-font-favorites',
        JSON.stringify(newFavorites)
      );
    }

    trackCustom({
      success: true,
    });
  };

  // Generate styles when input changes
  useEffect(() => {
    if (!input.trim()) {
      setGeneratedStyles([]);
      return;
    }

    const result = generateInstagramFonts(input);
    if (result.success) {
      setGeneratedStyles(result.styles);

      // Track generation
      addToHistory({
        id: crypto.randomUUID(),
        tool: 'instagram-font-generator',
        input,
        output: `${result.styles.length} styles generated`,
        timestamp: Date.now(),
      });
    }
  }, [input, addToHistory]);

  // Filter styles based on search and platform
  const filteredStyles = useMemo(() => {
    let filtered = generatedStyles;

    // Filter by search
    if (searchFilter.trim()) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter((style) =>
        style.name.toLowerCase().includes(search)
      );
    }

    // Filter by platform compatibility
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(
        (style) =>
          style.compatibility[
            selectedPlatform as keyof FontStyle['compatibility']
          ]
      );
    }

    // Sort: favorites first, then alphabetically
    return filtered.sort((a, b) => {
      const aFav = localFavoriteStyles.includes(a.id);
      const bFav = localFavoriteStyles.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [generatedStyles, searchFilter, selectedPlatform, localFavoriteStyles]);

  // Show only first 10 styles initially for performance
  const stylesToShow = showAllStyles
    ? filteredStyles
    : filteredStyles.slice(0, 10);

  const handleCopyStyle = async (styleId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStyleId(styleId);
      setTimeout(() => setCopiedStyleId(null), 2000);

      trackCustom({ success: true });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyAll = async () => {
    const allText = filteredStyles
      .map((style) => `${style.name}:\n${style.text}\n`)
      .join('\n');
    await copyAll(allText);

    trackUse(input, allText, {
      success: true,
    });
  };

  const charCount = input.length;
  const isOverBioLimit = charCount > MAX_CHARS_BIO;
  const isOverPostLimit = charCount > MAX_CHARS_POST;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Instagram Font Generator
          </h3>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Info Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="flex gap-3">
            <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Generate stylized text using Unicode characters
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                These fonts work on Instagram, WhatsApp, Twitter, Facebook and
                most social media platforms. No font installation required!
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Text
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`font-mono ${
                  isOverPostLimit
                    ? 'text-red-500'
                    : isOverBioLimit
                      ? 'text-orange-500'
                      : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {charCount} / {MAX_CHARS_BIO}
              </span>
              <span className="text-gray-400">bio</span>
              <span className="text-gray-300">|</span>
              <span
                className={`font-mono ${
                  isOverPostLimit
                    ? 'text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {charCount} / {MAX_CHARS_POST}
              </span>
              <span className="text-gray-400">post</span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your text here... (e.g., Your Name, Bio, Caption)"
            className="h-32 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:outline-none dark:bg-gray-900 dark:text-white"
            style={{
              borderColor: `${categoryColor}30`,
            }}
            onFocus={(e) => (e.target.style.borderColor = categoryColor)}
            onBlur={(e) => (e.target.style.borderColor = `${categoryColor}30`)}
            maxLength={MAX_CHARS_POST}
          />
          {isOverBioLimit && !isOverPostLimit && (
            <p className="text-sm text-orange-500">
              ⚠️ Text exceeds Instagram bio limit (150 characters)
            </p>
          )}
          {isOverPostLimit && (
            <p className="text-sm text-red-500">
              ❌ Text exceeds Instagram post limit (2200 characters)
            </p>
          )}
        </div>

        {/* Filters */}
        {generatedStyles.length > 0 && (
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search styles..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Platform:
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedPlatform('all')}
                  className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                    selectedPlatform === 'all'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlatform === 'all'
                        ? categoryColor
                        : 'transparent',
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`rounded p-2 transition-colors ${
                    selectedPlatform === 'instagram'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlatform === 'instagram'
                        ? categoryColor
                        : 'transparent',
                  }}
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedPlatform('whatsapp')}
                  className={`rounded p-2 transition-colors ${
                    selectedPlatform === 'whatsapp'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlatform === 'whatsapp'
                        ? categoryColor
                        : 'transparent',
                  }}
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedPlatform('twitter')}
                  className={`rounded p-2 transition-colors ${
                    selectedPlatform === 'twitter'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlatform === 'twitter'
                        ? categoryColor
                        : 'transparent',
                  }}
                  title="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedPlatform('facebook')}
                  className={`rounded p-2 transition-colors ${
                    selectedPlatform === 'facebook'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlatform === 'facebook'
                        ? categoryColor
                        : 'transparent',
                  }}
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats and Actions */}
        {generatedStyles.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredStyles.length} style
              {filteredStyles.length !== 1 ? 's' : ''} available
              {localFavoriteStyles.length > 0 &&
                ` • ${localFavoriteStyles.length} favorite${localFavoriteStyles.length !== 1 ? 's' : ''}`}
            </p>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {copiedAll ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied All!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy All
                </>
              )}
            </button>
          </div>
        )}

        {/* Styles Grid */}
        {stylesToShow.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {stylesToShow.map((style) => {
                const isCopied = copiedStyleId === style.id;
                const isFavorited = localFavoriteStyles.includes(style.id);

                return (
                  <div
                    key={style.id}
                    className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavoriteStyle(style.id)}
                      className="absolute right-2 top-2 rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={
                        isFavorited
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isFavorited
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {/* Style Name */}
                    <div className="mb-2 pr-8">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {style.name}
                      </h4>
                    </div>

                    {/* Preview */}
                    <div
                      className="mb-3 min-h-[3rem] break-words rounded-lg bg-gray-50 p-3 text-center text-lg dark:bg-gray-900"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {style.text}
                    </div>

                    {/* Compatibility Icons */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Works on:</span>
                      {style.compatibility.instagram && (
                        <Instagram className="h-3.5 w-3.5 text-pink-500" />
                      )}
                      {style.compatibility.whatsapp && (
                        <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                      )}
                      {style.compatibility.twitter && (
                        <Twitter className="h-3.5 w-3.5 text-blue-500" />
                      )}
                      {style.compatibility.facebook && (
                        <Facebook className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyStyle(style.id, style.text)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: isCopied ? '#10b981' : categoryColor,
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {!showAllStyles && filteredStyles.length > 10 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllStyles(true)}
                  className="rounded-lg px-6 py-3 text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                  }}
                >
                  Show All {filteredStyles.length} Styles
                </button>
              </div>
            )}
          </div>
        ) : input.trim() ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">
              No styles match your filters. Try adjusting your search or
              platform selection.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900">
            <Sparkles
              className="mx-auto mb-4 h-12 w-12"
              style={{ color: categoryColor }}
            />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Type your text above to see all styles
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {fontStyles.length}+ unique Unicode font styles available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
