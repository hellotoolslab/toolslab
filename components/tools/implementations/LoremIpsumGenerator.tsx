'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CopyIcon, CheckIcon, RefreshCwIcon, DownloadIcon } from 'lucide-react';
import { useToolStore } from '@/lib/store/toolStore';
import { BaseToolProps } from '@/lib/types/tools';
import { useScrollToResult } from '@/lib/hooks/useScrollToResult';
import {
  GenerationType,
  OutputFormat,
  TextVariant,
  LoremIpsumOptions,
  LoremIpsumResult,
  generateLoremIpsum,
  getDefaultOptions,
  getVariantNames,
  getTypeNames,
  getFormatNames,
} from '@/lib/tools/lorem-ipsum-generator';

interface LoremIpsumGeneratorProps extends BaseToolProps {}

export default function LoremIpsumGenerator({
  dictionary,
}: LoremIpsumGeneratorProps) {
  const { addToHistory } = useToolStore();
  const { resultRef, scrollToResult } = useScrollToResult({
    onlyIfNotVisible: false,
  });

  const [options, setOptions] =
    useState<LoremIpsumOptions>(getDefaultOptions());
  const [result, setResult] = useState<LoremIpsumResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState<number>(Date.now());
  const shouldScrollRef = useRef(false); // Track if scroll should happen (only on user action)

  // Get translations with fallbacks
  const t = dictionary || {};
  const labels = {
    generateType: t.generateType || 'Generate',
    count: t.count || 'Count',
    variant: t.variant || 'Text Style',
    format: t.format || 'Output Format',
    startWithLorem: t.startWithLorem || 'Start with "Lorem ipsum..."',
    generate: t.generate || 'Generate',
    regenerate: t.regenerate || 'Regenerate',
    copy: t.copy || 'Copy',
    copied: t.copied || 'Copied!',
    download: t.download || 'Download',
    result: t.result || 'Generated Text',
    statistics: t.statistics || 'Statistics',
    words: t.words || 'Words',
    characters: t.characters || 'Characters',
    sentences: t.sentences || 'Sentences',
    paragraphs: t.paragraphs || 'Paragraphs',
    options: t.options || 'Options',
  };

  // Generate text (internal, no scroll)
  const generateText = useCallback(() => {
    const startTime = Date.now();
    const newSeed = Date.now();
    setSeed(newSeed);
    const generated = generateLoremIpsum(options, newSeed);
    setResult(generated);

    // Track usage
    addToHistory({
      id: crypto.randomUUID(),
      tool: 'lorem-ipsum-generator',
      input: JSON.stringify(options),
      output: generated.text,
      timestamp: startTime,
    });
  }, [options, addToHistory]);

  // Generate text (user action, with scroll)
  const handleGenerate = useCallback(() => {
    shouldScrollRef.current = true;
    generateText();
  }, [generateText]);

  // Regenerate with new seed (user action, with scroll)
  const handleRegenerate = useCallback(() => {
    shouldScrollRef.current = true;
    generateText();
  }, [generateText]);

  // Auto-scroll when result changes (only on user action, not on initial mount)
  useEffect(() => {
    if (result && shouldScrollRef.current) {
      scrollToResult();
      shouldScrollRef.current = false;
    }
  }, [result, scrollToResult]);

  // Generate initial text on mount (no scroll)
  useEffect(() => {
    generateText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  }, [result]);

  // Download as file
  const downloadText = useCallback(() => {
    if (!result) return;
    const extension =
      options.format === 'html'
        ? 'html'
        : options.format === 'markdown'
          ? 'md'
          : 'txt';
    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, options.format]);

  // Get max count based on type
  const getMaxCount = (type: GenerationType): number => {
    switch (type) {
      case 'words':
        return 500;
      case 'sentences':
        return 50;
      case 'paragraphs':
        return 20;
      default:
        return 100;
    }
  };

  const variantNames = getVariantNames();
  const typeNames = getTypeNames();
  const formatNames = getFormatNames();

  return (
    <div className="space-y-6">
      {/* Options Card */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {labels.options}
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Generation Type */}
          <div>
            <Label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              {labels.generateType}
            </Label>
            <Select
              value={options.type}
              onValueChange={(value) =>
                setOptions({
                  ...options,
                  type: value as GenerationType,
                  count: Math.min(
                    options.count,
                    getMaxCount(value as GenerationType)
                  ),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(typeNames) as [GenerationType, string][]).map(
                  ([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Text Variant */}
          <div>
            <Label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              {labels.variant}
            </Label>
            <Select
              value={options.variant}
              onValueChange={(value) =>
                setOptions({ ...options, variant: value as TextVariant })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(variantNames) as [TextVariant, string][]).map(
                  ([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Count Slider */}
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              {labels.count}: {options.count}{' '}
              {typeNames[options.type].toLowerCase()}
            </Label>
            <Slider
              value={[options.count]}
              onValueChange={([value]) =>
                setOptions({ ...options, count: value })
              }
              min={1}
              max={getMaxCount(options.type)}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Output Format */}
          <div>
            <Label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              {labels.format}
            </Label>
            <Select
              value={options.format}
              onValueChange={(value) =>
                setOptions({ ...options, format: value as OutputFormat })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(formatNames) as [OutputFormat, string][]).map(
                  ([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Start with Lorem Ipsum */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              {labels.startWithLorem}
            </Label>
            <Switch
              checked={options.startWithLoremIpsum}
              onCheckedChange={(checked) =>
                setOptions({ ...options, startWithLoremIpsum: checked })
              }
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex gap-3">
          <Button onClick={handleGenerate} className="flex-1">
            {labels.generate}
          </Button>
          <Button variant="outline" onClick={handleRegenerate}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            {labels.regenerate}
          </Button>
        </div>
      </Card>

      {/* Result Card */}
      {result && (
        <div ref={resultRef}>
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {labels.result}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      {labels.copied}
                    </>
                  ) : (
                    <>
                      <CopyIcon className="mr-2 h-4 w-4" />
                      {labels.copy}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadText}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  {labels.download}
                </Button>
              </div>
            </div>

            {/* Generated Text */}
            <Textarea
              value={result.text}
              readOnly
              className="min-h-[200px] font-mono text-sm"
              rows={10}
            />

            {/* Statistics */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary">
                  {result.wordCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {labels.words}
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary">
                  {result.charCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {labels.characters}
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary">
                  {result.sentenceCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {labels.sentences}
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary">
                  {result.paragraphCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {labels.paragraphs}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Presets */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Presets
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              type: 'paragraphs' as GenerationType,
              count: 1,
              label: '1 Paragraph',
            },
            {
              type: 'paragraphs' as GenerationType,
              count: 3,
              label: '3 Paragraphs',
            },
            {
              type: 'paragraphs' as GenerationType,
              count: 5,
              label: '5 Paragraphs',
            },
            {
              type: 'sentences' as GenerationType,
              count: 5,
              label: '5 Sentences',
            },
            {
              type: 'sentences' as GenerationType,
              count: 10,
              label: '10 Sentences',
            },
            { type: 'words' as GenerationType, count: 50, label: '50 Words' },
            { type: 'words' as GenerationType, count: 100, label: '100 Words' },
            { type: 'words' as GenerationType, count: 200, label: '200 Words' },
          ].map((preset) => (
            <Button
              key={`${preset.type}-${preset.count}`}
              variant="outline"
              size="sm"
              onClick={() => {
                shouldScrollRef.current = true;
                setOptions({
                  ...options,
                  type: preset.type,
                  count: preset.count,
                });
                const startTime = Date.now();
                const newSeed = Date.now();
                setSeed(newSeed);
                const generated = generateLoremIpsum(
                  { ...options, type: preset.type, count: preset.count },
                  newSeed
                );
                setResult(generated);
                addToHistory({
                  id: crypto.randomUUID(),
                  tool: 'lorem-ipsum-generator',
                  input: JSON.stringify({
                    ...options,
                    type: preset.type,
                    count: preset.count,
                  }),
                  output: generated.text,
                  timestamp: startTime,
                });
              }}
              className={
                options.type === preset.type && options.count === preset.count
                  ? 'border-primary bg-primary/10'
                  : ''
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
