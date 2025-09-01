'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Clock,
  Calendar,
  Copy,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Command,
  BookOpen,
  History,
  Star,
  Zap,
  Heart,
  HeartHandshake,
  Trash2,
  Plus,
  Import,
  FileDown,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  parseCronExpression,
  buildCronExpression,
  exportCronExpression,
  CRON_PRESETS,
  type CronParseResult,
  type CronPreset,
} from '@/lib/tools/crontab';
import {
  useCrontabStore,
  exportFavorites,
  importFavorites,
} from '@/lib/stores/crontab-store';
import { BaseToolProps } from '@/lib/types/tools';

interface CrontabBuilderProps extends BaseToolProps {}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  // USA Timezones
  { value: 'America/New_York', label: 'US Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'US Central Time (CT)' },
  { value: 'America/Denver', label: 'US Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'US Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'US Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'US Alaska Time (AKST)' },
  { value: 'Pacific/Honolulu', label: 'US Hawaii Time (HST)' },
  // Europe
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  // Asia
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai/Beijing (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Kolkata', label: 'India/Mumbai (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  // Oceania
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
  // Americas (other)
  { value: 'America/Toronto', label: 'Toronto (ET)' },
  { value: 'America/Vancouver', label: 'Vancouver (PT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
];

// Get user's timezone for dynamic addition to options
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

// Create timezone options with user's timezone at the top if not already present
const createTimezoneOptions = () => {
  const userTz = getUserTimezone();
  const existingOptions = [...TIMEZONE_OPTIONS];

  // Check if user's timezone is already in the list
  const hasUserTz = existingOptions.some((opt) => opt.value === userTz);

  if (!hasUserTz && userTz !== 'UTC') {
    // Add user's timezone at the top with a special label
    existingOptions.unshift({
      value: userTz,
      label: `${userTz.replace('_', ' ')} (Your timezone)`,
    });
  }

  return existingOptions;
};

const EXPORT_FORMATS = [
  { value: 'shell', label: 'Shell Script' },
  { value: 'docker', label: 'Docker Compose' },
  { value: 'k8s', label: 'Kubernetes CronJob' },
  { value: 'github-actions', label: 'GitHub Actions' },
  { value: 'python', label: 'Python (APScheduler)' },
  { value: 'nodejs', label: 'Node.js (node-cron)' },
];

export default function CrontabBuilder({
  categoryColor,
  initialInput,
  onInputChange,
  onOutputChange,
}: CrontabBuilderProps) {
  const [inputExpression, setInputExpression] = useState(
    initialInput || '*/15 0 1,15 * 1-5'
  );
  const [parseResult, setParseResult] = useState<CronParseResult | null>(null);
  const [activeTab, setActiveTab] = useState('parser');
  const [executionsLimit, setExecutionsLimit] = useState(3);
  const [favoritesSearchQuery, setFavoritesSearchQuery] = useState('');

  // Store hooks
  const {
    history,
    favorites,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
    clearHistory,
    removeFromHistory,
    settings,
    updateSettings,
  } = useCrontabStore();

  // Use timezone from store, with fallback to browser timezone
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    return (
      settings.selectedTimezone ||
      (typeof window !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        : 'UTC')
    );
  });

  // Builder state
  const [builderFields, setBuilderFields] = useState({
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    weekday: '*',
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('shell');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isUpdatingFromBuilder = useRef(false);
  const isUpdatingFromExpression = useRef(false);

  // Parse expression when input changes
  const parseExpression = useCallback(
    (expression: string) => {
      if (!expression.trim()) {
        setParseResult(null);
        return;
      }

      try {
        const result = parseCronExpression(expression, selectedTimezone);
        setParseResult(result);
        onOutputChange?.(JSON.stringify(result, null, 2));
      } catch (error) {
        setParseResult(null);
        toast.error('Failed to parse cron expression');
      }
    },
    [selectedTimezone, onOutputChange]
  );

  // Update expression when builder fields change - don't use useCallback to avoid circular deps
  const updateFromBuilder = () => {
    if (isUpdatingFromExpression.current) return;
    isUpdatingFromBuilder.current = true;
    const expression = buildCronExpression(builderFields);
    setInputExpression(expression);
    parseExpression(expression);
    isUpdatingFromBuilder.current = false;
  };

  // Handle preset selection
  const handlePresetSelect = (preset: CronPreset) => {
    setInputExpression(preset.expression);
    setSelectedPreset(preset.expression);
    parseExpression(preset.expression);
    onInputChange?.(preset.expression);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputExpression(value);
    setSelectedPreset('');
    parseExpression(value);
    onInputChange?.(value);
  };

  // Handle manual parse button click
  const handleParseExpression = () => {
    parseExpression(inputExpression);
  };

  // Clear all inputs and results
  const clearAll = () => {
    setInputExpression('');
    setSelectedPreset('');
    setParseResult(null);
    setBuilderFields({
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      weekday: '*',
    });
    onInputChange?.('');
    onOutputChange?.('');
  };

  // Update builder fields from expression
  const updateBuilderFromExpression = (expression: string) => {
    if (isUpdatingFromBuilder.current) return;
    isUpdatingFromExpression.current = true;
    const parts = expression.split(' ');
    if (parts.length === 5) {
      setBuilderFields({
        minute: parts[0],
        hour: parts[1],
        day: parts[2],
        month: parts[3],
        weekday: parts[4],
      });
    }
    isUpdatingFromExpression.current = false;
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Export expression
  const handleExport = () => {
    if (!parseResult) return;
    const exported = exportCronExpression(
      parseResult.expression,
      exportFormat as any
    );
    handleCopy(exported);
  };

  // Add to favorites
  const handleAddToFavorites = () => {
    if (!parseResult) return;

    const suggestedName =
      parseResult.description.length > 50
        ? parseResult.description.substring(0, 50) + '...'
        : parseResult.description;

    const name = prompt('Enter a name for this favorite:', suggestedName);
    if (!name || !name.trim()) return;

    addToFavorites({
      name: name.trim(),
      expression: parseResult.expression,
      description: parseResult.description,
      category: 'custom',
    });

    toast.success('Added to favorites!');
  };

  // Load from history/favorites
  const handleLoadExpression = (expression: string) => {
    setInputExpression(expression);
    setSelectedPreset('');
    parseExpression(expression);
    onInputChange?.(expression);
  };

  // Export favorites
  const handleExportFavorites = () => {
    const data = exportFavorites();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crontab-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Favorites exported!');
  };

  // Import favorites
  const handleImportFavorites = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const result = importFavorites(content);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Effects
  useEffect(() => {
    if (!isUpdatingFromBuilder.current) {
      parseExpression(inputExpression);
    }
  }, [inputExpression, selectedTimezone, parseExpression]);

  // Add to history when parsing succeeds
  useEffect(() => {
    if (
      parseResult &&
      parseResult.validation.isValid &&
      inputExpression.trim()
    ) {
      addToHistory(
        parseResult.expression,
        parseResult.description,
        selectedTimezone
      );
    }
  }, [parseResult, selectedTimezone, inputExpression, addToHistory]);

  // Save timezone to store when it changes
  useEffect(() => {
    if (selectedTimezone && selectedTimezone !== settings.selectedTimezone) {
      updateSettings({ selectedTimezone });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.selectedTimezone, updateSettings]);

  // Load saved timezone on mount
  useEffect(() => {
    if (
      settings.selectedTimezone &&
      settings.selectedTimezone !== selectedTimezone
    ) {
      setSelectedTimezone(settings.selectedTimezone);
    }
  }, [settings.selectedTimezone]);

  // Remove the automatic update from builder - only update when fields actually change via user interaction

  useEffect(() => {
    if (inputExpression && !isUpdatingFromBuilder.current) {
      updateBuilderFromExpression(inputExpression);
    }
  }, [inputExpression]);

  const presetsByCategory = CRON_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = [];
      }
      acc[preset.category].push(preset);
      return acc;
    },
    {} as Record<string, CronPreset[]>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center text-lg"
              style={{ color: categoryColor }}
            >
              ⏰
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Crontab Builder
          </h3>
        </div>
        {parseResult?.validation.isValid && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Valid Expression
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Sample Data */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInputExpression('*/15 * * * *')}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Every 15 mins
            </button>
            <button
              onClick={() => setInputExpression('0 9-17 * * 1-5')}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Business Hours
            </button>
            <button
              onClick={() => setInputExpression('0 0 1 * *')}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Monthly
            </button>
            <button
              onClick={() => setInputExpression('@daily')}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Daily
            </button>
          </div>

          {/* Expression Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cron Expression
              </label>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTimezone}
                  onValueChange={setSelectedTimezone}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {createTimezoneOptions().map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative">
              <Input
                value={inputExpression}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="*/15 0 1,15 * 1-5 or @daily"
                className="border-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 text-center font-mono text-base dark:from-gray-900 dark:to-gray-800"
                style={{
                  borderColor:
                    parseResult?.validation.isValid === false
                      ? '#ef4444'
                      : `${categoryColor}30`,
                }}
                onFocus={(e) => (e.target.style.borderColor = categoryColor)}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    parseResult?.validation.isValid === false
                      ? '#ef4444'
                      : `${categoryColor}30`)
                }
              />
              {/* Field Labels */}
              <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex-1 text-center underline">minute</div>
                <div className="flex-1 text-center underline">hour</div>
                <div className="flex-1 text-center">
                  <div className="underline">day</div>
                  <div className="mt-0.5 text-[10px]">(month)</div>
                </div>
                <div className="flex-1 text-center underline">month</div>
                <div className="flex-1 text-center">
                  <div className="underline">day</div>
                  <div className="mt-0.5 text-[10px]">(week)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleParseExpression}
              disabled={!inputExpression}
              className="flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: categoryColor,
                boxShadow: `0 4px 12px ${categoryColor}40`,
              }}
            >
              <PlayCircle className="h-4 w-4" />
              Parse Expression
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
            {parseResult && parseResult.validation.isValid && (
              <button
                onClick={handleAddToFavorites}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Heart className="h-4 w-4" />
                Save to Favorites
              </button>
            )}
          </div>
        </div>

        {/* Feedback Section - Now above tabs */}
        {parseResult && (
          <>
            {/* Error Display */}
            {parseResult.validation.errors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-600 dark:text-red-400">
                    Invalid Expression
                  </span>
                </div>
                <ul className="list-inside list-disc text-red-600 dark:text-red-400">
                  {parseResult.validation.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning Display */}
            {parseResult.validation.warnings.length > 0 &&
              parseResult.validation.isValid && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      Warnings
                    </span>
                  </div>
                  <ul className="list-inside list-disc text-yellow-600 dark:text-yellow-400">
                    {parseResult.validation.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Success Display */}
            {parseResult.validation.isValid && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Valid Expression
                  </span>
                </div>
                <p className="text-green-600 dark:text-green-400">
                  {parseResult.description}
                </p>
              </div>
            )}
          </>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="parser" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Parser
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({history.length})
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Parser Tab */}
          <TabsContent value="parser" className="space-y-4">
            {parseResult && parseResult.validation.isValid && (
              <>
                {/* Next Executions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Next Executions ({selectedTimezone})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="executions-limit"
                          className="text-sm font-normal"
                        >
                          Show:
                        </Label>
                        <Select
                          value={executionsLimit.toString()}
                          onValueChange={(value) =>
                            setExecutionsLimit(parseInt(value))
                          }
                        >
                          <SelectTrigger id="executions-limit" className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {parseResult.nextExecutions
                        .slice(0, executionsLimit)
                        .map((execution, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded border p-3 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">
                                {execution.humanReadable}
                              </div>
                              <div className="text-sm text-gray-600">
                                {execution.relativeTime}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(execution.humanReadable)
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      {parseResult.nextExecutions.length > executionsLimit && (
                        <div className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          ... and{' '}
                          {parseResult.nextExecutions.length - executionsLimit}{' '}
                          more executions
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Minute Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Minute (0-59)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={builderFields.minute}
                    onChange={(e) => {
                      const newFields = {
                        ...builderFields,
                        minute: e.target.value,
                      };
                      setBuilderFields(newFields);
                      // Manually trigger update
                      isUpdatingFromBuilder.current = true;
                      const expression = buildCronExpression(newFields);
                      setInputExpression(expression);
                      parseExpression(expression);
                      isUpdatingFromBuilder.current = false;
                    }}
                    placeholder="*"
                    className="font-mono"
                  />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, minute: '*' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, minute: '*/5' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every 5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, minute: '0' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      At 0
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hour Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Hour (0-23)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={builderFields.hour}
                    onChange={(e) => {
                      const newFields = {
                        ...builderFields,
                        hour: e.target.value,
                      };
                      setBuilderFields(newFields);
                      // Manually trigger update
                      isUpdatingFromBuilder.current = true;
                      const expression = buildCronExpression(newFields);
                      setInputExpression(expression);
                      parseExpression(expression);
                      isUpdatingFromBuilder.current = false;
                    }}
                    placeholder="*"
                    className="font-mono"
                  />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, hour: '*' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, hour: '0' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Midnight
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, hour: '9-17' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      9-17
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Day Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Day of Month (1-31)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={builderFields.day}
                    onChange={(e) => {
                      const newFields = {
                        ...builderFields,
                        day: e.target.value,
                      };
                      setBuilderFields(newFields);
                      // Manually trigger update
                      isUpdatingFromBuilder.current = true;
                      const expression = buildCronExpression(newFields);
                      setInputExpression(expression);
                      parseExpression(expression);
                      isUpdatingFromBuilder.current = false;
                    }}
                    placeholder="*"
                    className="font-mono"
                  />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, day: '*' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, day: '1' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      1st
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, day: '15' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      15th
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Month Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Month (1-12)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={builderFields.month}
                    onChange={(e) => {
                      const newFields = {
                        ...builderFields,
                        month: e.target.value,
                      };
                      setBuilderFields(newFields);
                      // Manually trigger update
                      isUpdatingFromBuilder.current = true;
                      const expression = buildCronExpression(newFields);
                      setInputExpression(expression);
                      parseExpression(expression);
                      isUpdatingFromBuilder.current = false;
                    }}
                    placeholder="*"
                    className="font-mono"
                  />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, month: '*' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, month: '1' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      January
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = {
                          ...builderFields,
                          month: '3,6,9,12',
                        };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Q1,Q2,Q3,Q4
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekday Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Day of Week (0-7)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={builderFields.weekday}
                    onChange={(e) => {
                      const newFields = {
                        ...builderFields,
                        weekday: e.target.value,
                      };
                      setBuilderFields(newFields);
                      // Manually trigger update
                      isUpdatingFromBuilder.current = true;
                      const expression = buildCronExpression(newFields);
                      setInputExpression(expression);
                      parseExpression(expression);
                      isUpdatingFromBuilder.current = false;
                    }}
                    placeholder="*"
                    className="font-mono"
                  />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, weekday: '*' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Every day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, weekday: '1-5' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Mon-Fri
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newFields = { ...builderFields, weekday: '0,6' };
                        setBuilderFields(newFields);
                        isUpdatingFromBuilder.current = true;
                        const expression = buildCronExpression(newFields);
                        setInputExpression(expression);
                        parseExpression(expression);
                        isUpdatingFromBuilder.current = false;
                      }}
                    >
                      Sat-Sun
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-4">
            {Object.entries(presetsByCategory).map(([category, presets]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {category.replace('-', ' ')} Schedules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {presets.map((preset) => (
                      <div
                        key={preset.expression}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          selectedPreset === preset.expression
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => handlePresetSelect(preset)}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {preset.name}
                              </h4>
                            </div>
                            <Badge
                              variant="secondary"
                              className="inline-flex w-fit whitespace-nowrap font-mono text-xs"
                            >
                              {preset.expression}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Favorite Expressions</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImportFavorites}
                    >
                      <Import className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportFavorites}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {favorites.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search favorites by name..."
                      value={favoritesSearchQuery}
                      onChange={(e) => setFavoritesSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}

                {favorites.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <Heart className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No favorite expressions yet.</p>
                    <p className="text-sm">
                      Parse a valid expression and click the heart to save it.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites
                      .filter((favorite) =>
                        favorite.name
                          .toLowerCase()
                          .includes(favoritesSearchQuery.toLowerCase())
                      )
                      .map((favorite) => (
                        <div
                          key={favorite.id}
                          className="flex items-center justify-between rounded border p-3 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        >
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                              handleLoadExpression(favorite.expression)
                            }
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{favorite.name}</h4>
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {favorite.expression}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {favorite.description}
                              </p>
                              {favorite.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {favorite.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(favorite.expression)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromFavorites(favorite.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {favorites.length > 0 &&
                      favorites.filter((favorite) =>
                        favorite.name
                          .toLowerCase()
                          .includes(favoritesSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                          <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
                          <p>
                            No favorites found matching &quot;
                            {favoritesSearchQuery}&quot;
                          </p>
                          <p className="mt-2 text-sm">
                            Try searching with different keywords
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent History</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    disabled={history.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <History className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No history yet.</p>
                    <p className="text-sm">
                      Start parsing expressions to build your history.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 20).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded border p-3 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleLoadExpression(item.expression)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {item.expression}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {item.timezone}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(item.expression)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const suggestedName =
                                item.description.length > 50
                                  ? item.description.substring(0, 50) + '...'
                                  : item.description;

                              const name = prompt(
                                'Enter a name for this favorite:',
                                suggestedName
                              );
                              if (!name || !name.trim()) return;

                              addToFavorites({
                                name: name.trim(),
                                expression: item.expression,
                                description: item.description,
                                category: 'custom',
                              });
                              toast.success('Added to favorites!');
                            }}
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromHistory(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {history.length > 20 && (
                      <div className="py-2 text-center text-sm text-gray-500">
                        Showing latest 20 entries out of {history.length}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select
                      value={exportFormat}
                      onValueChange={setExportFormat}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPORT_FORMATS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleExport} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Copy Export Code
                    </Button>
                  </div>
                </div>

                {parseResult && (
                  <div>
                    <Label>Preview</Label>
                    <Textarea
                      value={exportCronExpression(
                        parseResult.expression,
                        exportFormat as any
                      )}
                      readOnly
                      className="mt-2 font-mono"
                      rows={10}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
