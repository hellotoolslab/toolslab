'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Copy,
  Download,
  RefreshCw,
  Plus,
  Minus,
  Palette,
  Code,
  Shuffle,
  Heart,
  Settings,
  Eye,
  MousePointer,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  generateGradientCSS,
  generateRandomGradient,
  generateCompatibleCSS,
  gradientPresets,
  extractColorsFromGradient,
  type GradientConfig,
  type GradientType,
  type ColorStop,
  type RadialShape,
  type RadialSize,
  type GradientPreset,
} from '@/lib/tools/gradient-generator';
import { useCopy } from '@/lib/hooks/useCopy';
import { useDownload } from '@/lib/hooks/useDownload';
import { BaseToolProps } from '@/lib/types/tools';

interface GradientGeneratorProps extends BaseToolProps {}

export default function GradientGenerator({
  categoryColor,
}: GradientGeneratorProps) {
  // Main gradient configuration
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    colorStops: [
      { id: 'stop-1', color: '#667eea', position: 0 },
      { id: 'stop-2', color: '#764ba2', position: 100 },
    ],
  });

  // UI state
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedStop, setSelectedStop] = useState<string | null>('stop-1');
  const [previewSize, setPreviewSize] = useState({ width: 400, height: 300 });
  const [showCompatibleCSS, setShowCompatibleCSS] = useState(false);
  const [savedGradients, setSavedGradients] = useState<GradientConfig[]>([]);
  const [selectedPresetCategory, setSelectedPresetCategory] = useState('all');

  // Refs and hooks
  const previewRef = useRef<HTMLDivElement>(null);
  const { copied, copy } = useCopy();
  const { downloadText } = useDownload();

  // Generate CSS result
  const gradientResult = useMemo(() => {
    return generateGradientCSS(gradientConfig);
  }, [gradientConfig]);

  // Load saved gradients from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gradient-generator-saved');
      if (saved) {
        setSavedGradients(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved gradients:', error);
    }
  }, []);

  // Update gradient configuration
  const updateGradientConfig = useCallback(
    (updates: Partial<GradientConfig>) => {
      setGradientConfig((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Update color stop
  const updateColorStop = useCallback(
    (stopId: string, updates: Partial<ColorStop>) => {
      setGradientConfig((prev) => ({
        ...prev,
        colorStops: prev.colorStops.map((stop) =>
          stop.id === stopId ? { ...stop, ...updates } : stop
        ),
      }));
    },
    []
  );

  // Add new color stop
  const addColorStop = useCallback(() => {
    const newPosition =
      gradientConfig.colorStops.length > 0
        ? gradientConfig.colorStops[gradientConfig.colorStops.length - 1]
            .position + 10
        : 50;

    const newStop: ColorStop = {
      id: `stop-${Date.now()}`,
      color: '#ffffff',
      position: Math.min(newPosition, 100),
    };

    setGradientConfig((prev) => ({
      ...prev,
      colorStops: [...prev.colorStops, newStop].sort(
        (a, b) => a.position - b.position
      ),
    }));

    setSelectedStop(newStop.id);
  }, [gradientConfig.colorStops]);

  // Remove color stop
  const removeColorStop = useCallback(
    (stopId: string) => {
      if (gradientConfig.colorStops.length <= 2) return; // Keep at least 2 stops

      setGradientConfig((prev) => ({
        ...prev,
        colorStops: prev.colorStops.filter((stop) => stop.id !== stopId),
      }));

      if (selectedStop === stopId) {
        setSelectedStop(gradientConfig.colorStops[0]?.id || null);
      }
    },
    [gradientConfig.colorStops, selectedStop]
  );

  // Generate random gradient
  const generateRandom = useCallback(() => {
    const randomGradient = generateRandomGradient(gradientConfig.type);
    setGradientConfig(randomGradient);
    setSelectedStop(randomGradient.colorStops[0]?.id || null);
  }, [gradientConfig.type]);

  // Save gradient to favorites
  const saveGradient = useCallback(() => {
    const newSaved = [...savedGradients, gradientConfig];
    setSavedGradients(newSaved);
    try {
      localStorage.setItem(
        'gradient-generator-saved',
        JSON.stringify(newSaved)
      );
      toast.success('Gradient saved successfully!');
    } catch (error) {
      console.error('Failed to save gradient:', error);
      toast.error('Failed to save gradient');
    }
  }, [gradientConfig, savedGradients]);

  // Load preset gradient
  const loadPreset = useCallback((preset: GradientPreset) => {
    setGradientConfig(preset.gradient);
    setSelectedStop(preset.gradient.colorStops[0]?.id || null);
  }, []);

  // Copy CSS to clipboard
  const handleCopyCSS = useCallback(async () => {
    if (gradientResult.success && gradientResult.css) {
      const cssText = showCompatibleCSS
        ? generateCompatibleCSS(gradientConfig)
        : `background: ${gradientResult.css};`;
      await copy(cssText);
    }
  }, [gradientResult, showCompatibleCSS, gradientConfig, copy]);

  // Download CSS file
  const handleDownloadCSS = useCallback(() => {
    if (gradientResult.success && gradientResult.css) {
      const cssContent = showCompatibleCSS
        ? generateCompatibleCSS(gradientConfig)
        : `.gradient {\n  background: ${gradientResult.css};\n}`;

      downloadText(cssContent, { filename: 'gradient.css' });
    }
  }, [gradientResult, showCompatibleCSS, gradientConfig, downloadText]);

  // Get filtered presets
  const filteredPresets = useMemo(() => {
    if (selectedPresetCategory === 'all') return gradientPresets;
    return gradientPresets.filter(
      (preset) => preset.category === selectedPresetCategory
    );
  }, [selectedPresetCategory]);

  // Get unique preset categories
  const presetCategories = useMemo(() => {
    const categories = [
      ...new Set(gradientPresets.map((preset) => preset.category)),
    ];
    return [
      { id: 'all', name: 'All' },
      ...categories.map((cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault();
            handleCopyCSS();
            break;
          case 'r':
            e.preventDefault();
            generateRandom();
            break;
          case 's':
            e.preventDefault();
            saveGradient();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopyCSS, generateRandom, saveGradient]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Main Editor Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Preview Panel */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateRandom}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Random
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveGradient}>
                    <Heart className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Gradient Preview */}
              <div className="space-y-4">
                <div
                  ref={previewRef}
                  className="relative rounded-lg border shadow-inner"
                  style={{
                    width: previewSize.width,
                    height: previewSize.height,
                    background: gradientResult.success
                      ? gradientResult.css
                      : '#f0f0f0',
                    maxWidth: '100%',
                  }}
                >
                  {/* Color Stop Indicators */}
                  {gradientConfig.type === 'linear' && (
                    <div className="absolute inset-0 flex items-center">
                      {gradientConfig.colorStops.map((stop) => (
                        <div
                          key={stop.id}
                          className={`absolute h-4 w-4 cursor-pointer rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 ${
                            selectedStop === stop.id
                              ? 'ring-2 ring-blue-500'
                              : ''
                          }`}
                          style={{
                            left: `${stop.position}%`,
                            backgroundColor: stop.color,
                            transform: 'translateX(-50%)',
                          }}
                          onClick={() => setSelectedStop(stop.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Size Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">
                      Width: {previewSize.width}px
                    </Label>
                    <Slider
                      value={[previewSize.width]}
                      onValueChange={([width]) =>
                        setPreviewSize((prev) => ({ ...prev, width }))
                      }
                      min={200}
                      max={600}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">
                      Height: {previewSize.height}px
                    </Label>
                    <Slider
                      value={[previewSize.height]}
                      onValueChange={([height]) =>
                        setPreviewSize((prev) => ({ ...prev, height }))
                      }
                      min={150}
                      max={500}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Controls Panel */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Settings</h3>

              <div className="space-y-6">
                {/* Gradient Type */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Gradient Type
                  </Label>
                  <Select
                    value={gradientConfig.type}
                    onValueChange={(value) =>
                      updateGradientConfig({ type: value as GradientType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                      <SelectItem value="conic">Conic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Linear Gradient Controls */}
                {gradientConfig.type === 'linear' && (
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Angle: {gradientConfig.angle || 90}°
                    </Label>
                    <Slider
                      value={[gradientConfig.angle || 90]}
                      onValueChange={([angle]) =>
                        updateGradientConfig({ angle })
                      }
                      min={0}
                      max={360}
                      step={1}
                    />
                  </div>
                )}

                {/* Radial Gradient Controls */}
                {gradientConfig.type === 'radial' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Shape
                        </Label>
                        <Select
                          value={gradientConfig.shape || 'ellipse'}
                          onValueChange={(value) =>
                            updateGradientConfig({
                              shape: value as RadialShape,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="ellipse">Ellipse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Size
                        </Label>
                        <Select
                          value={gradientConfig.size || 'farthest-corner'}
                          onValueChange={(value) =>
                            updateGradientConfig({ size: value as RadialSize })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="closest-side">
                              Closest Side
                            </SelectItem>
                            <SelectItem value="closest-corner">
                              Closest Corner
                            </SelectItem>
                            <SelectItem value="farthest-side">
                              Farthest Side
                            </SelectItem>
                            <SelectItem value="farthest-corner">
                              Farthest Corner
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Center X: {gradientConfig.position?.x || 50}%
                        </Label>
                        <Slider
                          value={[gradientConfig.position?.x || 50]}
                          onValueChange={([x]) =>
                            updateGradientConfig({
                              position: {
                                ...gradientConfig.position,
                                x,
                                y: gradientConfig.position?.y || 50,
                              },
                            })
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Center Y: {gradientConfig.position?.y || 50}%
                        </Label>
                        <Slider
                          value={[gradientConfig.position?.y || 50]}
                          onValueChange={([y]) =>
                            updateGradientConfig({
                              position: {
                                x: gradientConfig.position?.x || 50,
                                y,
                              },
                            })
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Conic Gradient Controls */}
                {gradientConfig.type === 'conic' && (
                  <>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Start Angle: {gradientConfig.angle || 0}°
                      </Label>
                      <Slider
                        value={[gradientConfig.angle || 0]}
                        onValueChange={([angle]) =>
                          updateGradientConfig({ angle })
                        }
                        min={0}
                        max={360}
                        step={1}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Center X: {gradientConfig.position?.x || 50}%
                        </Label>
                        <Slider
                          value={[gradientConfig.position?.x || 50]}
                          onValueChange={([x]) =>
                            updateGradientConfig({
                              position: {
                                ...gradientConfig.position,
                                x,
                                y: gradientConfig.position?.y || 50,
                              },
                            })
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block text-sm font-medium">
                          Center Y: {gradientConfig.position?.y || 50}%
                        </Label>
                        <Slider
                          value={[gradientConfig.position?.y || 50]}
                          onValueChange={([y]) =>
                            updateGradientConfig({
                              position: {
                                x: gradientConfig.position?.x || 50,
                                y,
                              },
                            })
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Color Stops */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-medium">Color Stops</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addColorStop}
                        disabled={gradientConfig.colorStops.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {gradientConfig.colorStops.map((stop, index) => (
                      <div
                        key={stop.id}
                        className={`rounded-lg border p-3 transition-colors ${
                          selectedStop === stop.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 cursor-pointer rounded border"
                            style={{ backgroundColor: stop.color }}
                            onClick={() => setSelectedStop(stop.id)}
                          />
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) =>
                              updateColorStop(stop.id, {
                                color: e.target.value,
                              })
                            }
                            className="h-8 w-16 cursor-pointer border-0"
                          />
                          <div className="flex-1">
                            <Label className="text-xs">
                              Position: {stop.position}%
                            </Label>
                            <Slider
                              value={[stop.position]}
                              onValueChange={([position]) =>
                                updateColorStop(stop.id, { position })
                              }
                              min={0}
                              max={100}
                              step={0.1}
                              className="mt-1"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeColorStop(stop.id)}
                            disabled={gradientConfig.colorStops.length <= 2}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          {/* Preset Categories */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gradient Presets</h3>
              <Select
                value={selectedPresetCategory}
                onValueChange={setSelectedPresetCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presetCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
                  onClick={() => loadPreset(preset)}
                >
                  <div
                    className="mb-3 h-20 rounded border"
                    style={{
                      background:
                        generateGradientCSS(preset.gradient).css || '#f0f0f0',
                    }}
                  />
                  <h4 className="font-medium">{preset.name}</h4>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {preset.category}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Code</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompatibleCSS(!showCompatibleCSS)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {showCompatibleCSS ? 'Simple' : 'Compatible'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyCSS}>
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy CSS'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSS}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {gradientResult.success ? (
              <div className="space-y-4">
                {/* CSS Output */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">CSS</Label>
                  <Textarea
                    value={
                      showCompatibleCSS
                        ? generateCompatibleCSS(gradientConfig)
                        : `background: ${gradientResult.css};`
                    }
                    readOnly
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                {/* Tailwind CSS */}
                {gradientResult.tailwindClass && (
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Tailwind CSS (Approximation)
                    </Label>
                    <Textarea
                      value={`<div class="${gradientResult.tailwindClass}"></div>`}
                      readOnly
                      className="min-h-[60px] font-mono text-sm"
                    />
                  </div>
                )}

                {/* SVG Output */}
                {gradientResult.svg &&
                  !gradientResult.svg.includes('not supported') && (
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        SVG
                      </Label>
                      <Textarea
                        value={`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
${gradientResult.svg}
</svg>`}
                        readOnly
                        className="min-h-[150px] font-mono text-sm"
                      />
                    </div>
                  )}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  {gradientResult.error || 'Failed to generate gradient'}
                </AlertDescription>
              </Alert>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Saved Gradients</h3>
              <Badge variant="secondary">{savedGradients.length} saved</Badge>
            </div>

            {savedGradients.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedGradients.map((saved, index) => (
                  <div
                    key={index}
                    className="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
                    onClick={() => {
                      setGradientConfig(saved);
                      setSelectedStop(saved.colorStops[0]?.id || null);
                      setActiveTab('editor');
                      toast.success('Gradient loaded successfully!');
                    }}
                  >
                    <div
                      className="mb-3 h-20 rounded border"
                      style={{
                        background: generateGradientCSS(saved).css || '#f0f0f0',
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      {saved.type} • {saved.colorStops.length} stops
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSaved = savedGradients.filter(
                          (_, i) => i !== index
                        );
                        setSavedGradients(newSaved);
                        localStorage.setItem(
                          'gradient-generator-saved',
                          JSON.stringify(newSaved)
                        );
                        toast.success('Gradient removed from saved');
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                No saved gradients yet. Create a gradient and save it to your
                favorites!
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Keyboard Shortcuts */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Keyboard shortcuts:</span>
            <div className="flex gap-4">
              <kbd className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                Ctrl+C
              </kbd>
              <span className="text-xs">Copy CSS</span>
              <kbd className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                Ctrl+R
              </kbd>
              <span className="text-xs">Random</span>
              <kbd className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                Ctrl+S
              </kbd>
              <span className="text-xs">Save</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('presets')}
            >
              <Palette className="mr-2 h-4 w-4" />
              Presets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('code')}
            >
              <Code className="mr-2 h-4 w-4" />
              Code
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
