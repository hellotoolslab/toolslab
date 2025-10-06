'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload,
  Download,
  Copy,
  FileText,
  Eye,
  Code,
  Table,
  Mail,
  AlertCircle,
  CheckCircle,
  Shield,
  ImageIcon,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToolTracking } from '@/lib/analytics/hooks/useToolTracking';
import {
  convertEmlToHtml,
  exportHeadersAsJson,
  getEmailSummary,
  type ParsedEmail,
  type ConversionResult,
} from '@/lib/tools/eml-to-html';

interface EmlToHtmlProps {
  defaultValue?: string;
  categoryColor?: string;
  locale?: string;
  dictionary?: any;
}

type ViewMode = 'raw' | 'rendered' | 'headers' | 'source';

export default function EmlToHtml({ defaultValue = '' }: EmlToHtmlProps) {
  const { trackUse, trackError } = useToolTracking('eml-to-html');
  const [emlInput, setEmlInput] = useState(defaultValue);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');
  const [sanitizeHtml, setSanitizeHtml] = useState(false);
  const [convertCid, setConvertCid] = useState(false);
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process EML content
  const processEml = useCallback(() => {
    if (!emlInput.trim()) {
      setResult(null);
      return;
    }

    setIsProcessing(true);

    try {
      const conversionResult = convertEmlToHtml(emlInput, {
        sanitizeHtml,
        removeScripts: true,
        convertCidToDataUri: convertCid,
        includeHeaders,
        maxAttachmentSize: 10 * 1024 * 1024, // 10MB
      });

      setResult(conversionResult);

      if (conversionResult.success) {
        trackUse(emlInput, conversionResult.html || '', { success: true });
      } else {
        trackError(
          new Error(conversionResult.error || 'Conversion failed'),
          emlInput.length
        );
      }
    } catch (error) {
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Conversion failed',
      };
      setResult(errorResult);
      trackError(
        error instanceof Error ? error : new Error(String(error)),
        emlInput.length
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    emlInput,
    sanitizeHtml,
    convertCid,
    includeHeaders,
    trackUse,
    trackError,
  ]);

  // Auto-process on input change (debounced would be better in production)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (emlInput.trim()) {
        processEml();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [emlInput, processEml]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEmlInput(content);
    };
    reader.readAsText(file);
  };

  // Copy to clipboard
  const copyToClipboard = async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert(`${label} copied to clipboard!`);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  };

  // Download file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export headers as JSON
  const exportHeaders = () => {
    if (!result?.parsedEmail) return;

    const json = exportHeadersAsJson(result.parsedEmail);
    downloadFile(json, 'email-headers.json', 'application/json');
  };

  // Download HTML
  const downloadHtml = () => {
    if (!result?.html) return;
    downloadFile(result.html, 'email.html', 'text/html');
  };

  // Get email summary
  const emailSummary = useMemo(() => {
    if (!result?.parsedEmail) return null;
    return getEmailSummary(result.parsedEmail);
  }, [result?.parsedEmail]);

  // Render current view
  const renderView = () => {
    if (!result) return null;

    switch (viewMode) {
      case 'raw':
        return (
          <div className="relative">
            <Textarea
              value={result.rawView || ''}
              readOnly
              className="min-h-[500px] resize-none font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-2"
              onClick={() => copyToClipboard(result.rawView || '', 'Raw EML')}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        );

      case 'rendered':
        return (
          <div className="relative">
            <Card className="min-h-[500px] bg-white p-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: result.html || '' }}
              />
            </Card>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(result.html || '', 'HTML')}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>
              <Button size="sm" variant="outline" onClick={downloadHtml}>
                <Download className="mr-2 h-4 w-4" />
                Download HTML
              </Button>
            </div>
          </div>
        );

      case 'headers':
        return (
          <div className="relative">
            <div
              className="min-h-[500px] overflow-auto rounded-lg border p-4"
              dangerouslySetInnerHTML={{ __html: result.headersHtml || '' }}
            />
            <div className="mt-4">
              <Button size="sm" variant="outline" onClick={exportHeaders}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
            </div>
          </div>
        );

      case 'source':
        return (
          <div className="relative">
            <Textarea
              value={result.sourceView || ''}
              readOnly
              className="min-h-[500px] resize-none font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-2"
              onClick={() =>
                copyToClipboard(result.sourceView || '', 'HTML Source')
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="eml-input">EML Content</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".eml,.msg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload EML
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEmlInput('')}
              >
                Clear
              </Button>
            </div>
          </div>

          <Textarea
            id="eml-input"
            placeholder="Paste EML content here or upload a file..."
            value={emlInput}
            onChange={(e) => setEmlInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sanitize"
                checked={sanitizeHtml}
                onChange={(e) => setSanitizeHtml(e.target.checked)}
              />
              <Label htmlFor="sanitize" className="cursor-pointer text-sm">
                Sanitize HTML (Remove scripts)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="convert-cid"
                checked={convertCid}
                onChange={(e) => setConvertCid(e.target.checked)}
              />
              <Label htmlFor="convert-cid" className="cursor-pointer text-sm">
                Convert inline images
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-headers"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
              />
              <Label
                htmlFor="include-headers"
                className="cursor-pointer text-sm"
              >
                Include headers
              </Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Email Summary */}
      {emailSummary && result?.success && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-950 dark:to-indigo-950">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Mail className="h-5 w-5" />
                Email Summary
              </h3>
              <div className="flex gap-2">
                {emailSummary.hasAuthentication && (
                  <Badge variant="outline" className="bg-green-100">
                    <Shield className="mr-1 h-3 w-3" />
                    Authenticated
                  </Badge>
                )}
                {emailSummary.hasTracking && (
                  <Badge variant="outline" className="bg-yellow-100">
                    <Eye className="mr-1 h-3 w-3" />
                    Tracking
                  </Badge>
                )}
                {emailSummary.hasAttachments && (
                  <Badge variant="outline">
                    <Paperclip className="mr-1 h-3 w-3" />
                    {emailSummary.attachmentCount} Attachment
                    {emailSummary.attachmentCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="font-semibold">From:</span> {emailSummary.from}
              </div>
              <div>
                <span className="font-semibold">To:</span>{' '}
                {emailSummary.to.join(', ')}
              </div>
              <div>
                <span className="font-semibold">Subject:</span>{' '}
                {emailSummary.subject}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {emailSummary.date}
              </div>
              {emailSummary.client && (
                <div>
                  <span className="font-semibold">Client:</span>{' '}
                  {emailSummary.client}
                </div>
              )}
              {emailSummary.template && (
                <div>
                  <span className="font-semibold">Template:</span>{' '}
                  {emailSummary.template}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Warnings */}
      {result?.warnings && result.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-inside list-disc space-y-1">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Error */}
      {result?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {/* Attachments */}
      {result?.parsedEmail?.attachments &&
        result.parsedEmail.attachments.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Paperclip className="h-5 w-5" />
              Attachments ({result.parsedEmail.attachments.length})
            </h3>
            <div className="space-y-2">
              {result.parsedEmail.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{attachment.filename}</div>
                      <div className="text-sm text-gray-500">
                        {attachment.contentType} •{' '}
                        {(attachment.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{attachment.encoding}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

      {/* Inline Images */}
      {result?.parsedEmail?.inlineImages &&
        result.parsedEmail.inlineImages.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <ImageIcon className="h-5 w-5" />
              Inline Images ({result.parsedEmail.inlineImages.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {result.parsedEmail.inlineImages.map((image, index) => (
                <div key={index} className="rounded-lg border p-2">
                  <div className="mb-1 truncate text-xs text-gray-500">
                    {image.filename}
                  </div>
                  <div className="text-xs text-gray-400">
                    {image.contentType}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      {/* View Tabs */}
      {result?.success && (
        <Card className="p-6">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rendered">
                <Eye className="mr-2 h-4 w-4" />
                Rendered
              </TabsTrigger>
              <TabsTrigger value="source">
                <Code className="mr-2 h-4 w-4" />
                Source
              </TabsTrigger>
              <TabsTrigger value="headers">
                <Table className="mr-2 h-4 w-4" />
                Headers
              </TabsTrigger>
              <TabsTrigger value="raw">
                <FileText className="mr-2 h-4 w-4" />
                Raw
              </TabsTrigger>
            </TabsList>

            <TabsContent value={viewMode} className="mt-4">
              {renderView()}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Help Text */}
      {!emlInput && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload an EML file or paste email content to get started. The tool
            supports RFC822/2822 format from Outlook, Thunderbird, Apple Mail,
            and other email clients.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
