'use client';

import { useState, useRef, useEffect } from 'react';
import { Tool } from '@/types/tool';
import {
  Copy,
  Download,
  RefreshCw,
  Settings,
  Check,
  Loader2,
  Upload,
  Zap,
  Maximize2,
  Minimize2,
  Trash2,
  Link,
  History,
} from 'lucide-react';
import JsonFormatter from './implementations/JsonFormatter';
import Base64Tool from './implementations/Base64Tool';
import UuidGenerator from './implementations/UuidGenerator';
import HashGenerator from './implementations/HashGenerator';
import PasswordGenerator from './implementations/PasswordGenerator';
import RegexTester from './implementations/RegexTester';
import ToolChainSuggestions from './ToolChainSuggestions';
import { useToolChaining } from '@/lib/hooks/useToolChaining';

interface ToolWorkspaceProps {
  tool: Tool;
  categoryColor: string;
  initialInput?: string;
}

export default function ToolWorkspace({
  tool,
  categoryColor,
  initialInput,
}: ToolWorkspaceProps) {
  const [input, setInput] = useState(initialInput || '');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Tool-specific options
  const [toolOptions, setToolOptions] = useState<any>({});

  // Initialize tool chaining
  const { chainedData, processOutput, chainContext, setProcessing } =
    useToolChaining({
      toolSlug: tool.slug,
      onDataReceived: (data) => {
        setInput(data);
      },
      onChainStepAdded: (step) => {
        console.log('Chain step added:', step);
      },
    });

  useEffect(() => {
    // Reset states when tool changes
    if (!chainedData) {
      setInput(initialInput || '');
    }
    setOutput('');
    setError(null);
    setProcessingTime(null);
  }, [tool.slug, initialInput, chainedData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlCmd = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + Enter - Process
      if (isCtrlCmd && event.key === 'Enter') {
        event.preventDefault();
        if (input.trim() && !isProcessing) {
          handleProcess();
        }
      }

      // Cmd/Ctrl + Shift + C - Copy output
      if (isCtrlCmd && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        if (output) {
          handleCopy();
        }
      }

      // Cmd/Ctrl + Shift + V - Paste to input
      if (isCtrlCmd && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        handlePaste();
      }

      // Cmd/Ctrl + Shift + R - Clear/Reset
      if (isCtrlCmd && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        handleClear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [input, output, isProcessing]);

  const handleProcess = async () => {
    setIsProcessing(true);
    setProcessing(true);
    setError(null);
    const startTime = performance.now();

    try {
      // Simulate processing for now
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Tool-specific processing would go here
      let result = '';
      switch (tool.slug) {
        case 'json-formatter':
          try {
            const parsed = JSON.parse(input);
            result = JSON.stringify(parsed, null, 2);
          } catch {
            throw new Error('Invalid JSON format');
          }
          break;
        case 'uuid-generator':
          result = crypto.randomUUID();
          break;
        case 'password-generator':
          const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
          result = Array.from(
            { length: 16 },
            () => chars[Math.floor(Math.random() * chars.length)]
          ).join('');
          break;
        default:
          result = input.toUpperCase(); // Default transformation
      }

      setOutput(result);
      const endTime = performance.now();
      setProcessingTime(Math.round(endTime - startTime));

      // Add to chain if we have valid input and output
      if (input.trim() && result) {
        processOutput(input, result, {
          processingTime: Math.round(endTime - startTime),
          options: toolOptions,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setProcessingTime(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      // Flash effect
      inputRef.current?.classList.add('ring-2', 'ring-green-500');
      setTimeout(() => {
        inputRef.current?.classList.remove('ring-2', 'ring-green-500');
      }, 500);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  // Render tool-specific implementation if available
  const renderToolImplementation = () => {
    switch (tool.slug) {
      case 'json-formatter':
        return <JsonFormatter categoryColor={categoryColor} />;
      case 'base64-encode':
        return <Base64Tool categoryColor={categoryColor} />;
      case 'uuid-generator':
        return <UuidGenerator categoryColor={categoryColor} />;
      case 'hash-generator':
        return <HashGenerator categoryColor={categoryColor} />;
      case 'password-generator':
        return <PasswordGenerator categoryColor={categoryColor} />;
      case 'regex-tester':
        return <RegexTester categoryColor={categoryColor} />;
      default:
        return null;
    }
  };

  // If tool has specific implementation, use it
  const hasImplementation = [
    'json-formatter',
    'base64-encode',
    'uuid-generator',
    'hash-generator',
    'password-generator',
    'regex-tester',
  ].includes(tool.slug);

  if (hasImplementation) {
    return renderToolImplementation();
  }

  // Default generic tool workspace
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-800 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      {/* Tool Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Workspace
          </h3>

          {/* Chain Context Indicator */}
          {chainContext.hasChainData && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 dark:border-blue-700 dark:from-blue-900/20 dark:to-purple-900/20">
              <Link className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Chained from{' '}
                {chainContext.previousSteps.length > 0
                  ? chainContext.previousSteps[
                      chainContext.previousSteps.length - 1
                    ]?.toolName
                  : 'previous tool'}
              </span>
            </div>
          )}

          {/* Chain Step Indicator */}
          {chainContext.totalSteps > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
              <History className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Step {chainContext.currentStepIndex + 1} of{' '}
                {chainContext.totalSteps + 1}
              </span>
            </div>
          )}

          {processingTime !== null && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Completed in {processingTime}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Options"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Upload className="h-4 w-4" style={{ color: categoryColor }} />
              Input
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{input.length} characters</span>
              <button
                onClick={handlePaste}
                className="rounded px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Paste
              </button>
              <button
                onClick={() => setInput('')}
                className="rounded px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!input}
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter or paste your input here..."
            className="h-40 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
            style={{
              borderColor: `${categoryColor}30`,
            }}
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleProcess}
            disabled={!input || isProcessing}
            className="group relative flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`,
            }}
            title="Cmd/Ctrl + Enter"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Process
                <kbd className="ml-2 hidden rounded border border-white/20 bg-black/20 px-1 py-0.5 text-xs group-hover:inline-flex">
                  ⌘↵
                </kbd>
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output}
            className="flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-medium transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="animate-shake rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="animate-slideIn space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4" style={{ color: categoryColor }} />
                Output
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {output.length} characters
                </span>
                <button
                  onClick={handleCopy}
                  className="group flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Cmd/Ctrl + Shift + C"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-sm">Copy</span>
                      <kbd className="ml-1 hidden rounded bg-gray-200 px-1 py-0.5 text-xs group-hover:inline-flex dark:bg-gray-600">
                        ⌘⇧C
                      </kbd>
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
              ref={outputRef}
              value={output}
              readOnly
              className="h-40 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 transition-all dark:bg-gray-900 dark:text-white"
              style={{
                borderColor: `${categoryColor}30`,
              }}
            />
          </div>
        )}

        {/* Advanced Options */}
        {showOptions && (
          <div className="animate-slideIn space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Advanced Options
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tool-specific options would appear here
            </p>
          </div>
        )}
      </div>

      {/* Tool Chain Suggestions */}
      <ToolChainSuggestions />
    </div>
  );
}
