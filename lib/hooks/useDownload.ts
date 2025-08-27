'use client';

import { useCallback } from 'react';
import { ERRORS } from '@/lib/constants/tools';

export interface DownloadOptions {
  filename?: string;
  mimeType?: string;
  timestamp?: boolean;
}

export interface DownloadReturn {
  downloadText: (content: string, options?: DownloadOptions) => Promise<void>;
  downloadBlob: (blob: Blob, filename: string) => Promise<void>;
  downloadJSON: (data: any, filename?: string) => Promise<void>;
  downloadCSV: (data: string[][], filename?: string) => Promise<void>;
  downloadBase64AsBinary: (
    base64: string,
    filename: string,
    mimeType?: string
  ) => Promise<void>;
}

/**
 * Unified download functionality for all tools
 * Eliminates duplicate download patterns across components
 */
export function useDownload(): DownloadReturn {
  const createDownloadLink = useCallback(
    (url: string, filename: string): void => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Ensure proper cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      URL.revokeObjectURL(url);
    },
    []
  );

  const downloadText = useCallback(
    async (content: string, options: DownloadOptions = {}): Promise<void> => {
      const {
        filename = 'download.txt',
        mimeType = 'text/plain',
        timestamp = false,
      } = options;

      try {
        if (!content) {
          throw new Error('No content to download');
        }

        const finalFilename = timestamp
          ? filename.replace(/(\.[^.]+)?$/, `-${Date.now()}$1`)
          : filename;

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        createDownloadLink(url, finalFilename);
      } catch (error) {
        throw new Error(
          `${ERRORS.DOWNLOAD_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [createDownloadLink]
  );

  const downloadBlob = useCallback(
    async (blob: Blob, filename: string): Promise<void> => {
      try {
        if (!blob) {
          throw new Error('No blob to download');
        }

        const url = URL.createObjectURL(blob);
        createDownloadLink(url, filename);
      } catch (error) {
        throw new Error(
          `${ERRORS.DOWNLOAD_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [createDownloadLink]
  );

  const downloadJSON = useCallback(
    async (data: any, filename: string = 'data.json'): Promise<void> => {
      try {
        if (data === null || data === undefined) {
          throw new Error('No data to download');
        }

        const jsonString = JSON.stringify(data, null, 2);
        await downloadText(jsonString, {
          filename,
          mimeType: 'application/json',
        });
      } catch (error) {
        throw new Error(
          `${ERRORS.DOWNLOAD_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [downloadText]
  );

  const downloadCSV = useCallback(
    async (data: string[][], filename: string = 'data.csv'): Promise<void> => {
      try {
        if (!data || data.length === 0) {
          throw new Error('No data to download');
        }

        const csvContent = data
          .map((row) =>
            row
              .map((cell) =>
                cell.includes(',') || cell.includes('"') || cell.includes('\n')
                  ? `"${cell.replace(/"/g, '""')}"`
                  : cell
              )
              .join(',')
          )
          .join('\n');

        await downloadText(csvContent, {
          filename,
          mimeType: 'text/csv',
        });
      } catch (error) {
        throw new Error(
          `${ERRORS.DOWNLOAD_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [downloadText]
  );

  const downloadBase64AsBinary = useCallback(
    async (
      base64: string,
      filename: string,
      mimeType: string = 'application/octet-stream'
    ): Promise<void> => {
      try {
        if (!base64) {
          throw new Error('No Base64 content to download');
        }

        const binaryString = atob(base64.replace(/\s/g, ''));
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: mimeType });
        await downloadBlob(blob, filename);
      } catch (error) {
        throw new Error(
          `${ERRORS.DOWNLOAD_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [downloadBlob]
  );

  return {
    downloadText,
    downloadBlob,
    downloadJSON,
    downloadCSV,
    downloadBase64AsBinary,
  };
}

/**
 * Hook for tools with multiple download format options
 */
export function useMultiFormatDownload() {
  const { downloadText, downloadJSON, downloadCSV, downloadBlob } =
    useDownload();

  const downloadInFormat = useCallback(
    async (
      content: string,
      format: 'txt' | 'json' | 'csv' | 'html' | 'xml',
      baseFilename: string = 'download'
    ) => {
      const formatConfigs = {
        txt: {
          mimeType: 'text/plain',
          ext: 'txt',
          processor: (content: string) => content,
        },
        json: {
          mimeType: 'application/json',
          ext: 'json',
          processor: (content: string) => {
            try {
              // Validate and format JSON
              const parsed = JSON.parse(content);
              return JSON.stringify(parsed, null, 2);
            } catch {
              return content;
            }
          },
        },
        csv: {
          mimeType: 'text/csv',
          ext: 'csv',
          processor: (content: string) => content,
        },
        html: {
          mimeType: 'text/html',
          ext: 'html',
          processor: (content: string) => content,
        },
        xml: {
          mimeType: 'application/xml',
          ext: 'xml',
          processor: (content: string) => content,
        },
      };

      const config = formatConfigs[format];
      const processedContent = config.processor(content);
      const filename = `${baseFilename}.${config.ext}`;

      await downloadText(processedContent, {
        filename,
        mimeType: config.mimeType,
      });
    },
    [downloadText]
  );

  return {
    downloadText,
    downloadJSON,
    downloadCSV,
    downloadBlob,
    downloadInFormat,
  };
}

/**
 * Utility functions for file extension detection
 */
export const fileUtils = {
  getExtensionFromMimeType: (mimeType: string): string => {
    const mimeToExt: Record<string, string> = {
      'text/plain': 'txt',
      'application/json': 'json',
      'text/html': 'html',
      'text/css': 'css',
      'application/javascript': 'js',
      'text/csv': 'csv',
      'application/xml': 'xml',
      'text/xml': 'xml',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'application/pdf': 'pdf',
      'application/zip': 'zip',
    };

    return mimeToExt[mimeType] || 'bin';
  },

  generateFilename: (
    base: string,
    extension?: string,
    includeTimestamp: boolean = false
  ): string => {
    const timestamp = includeTimestamp ? `-${Date.now()}` : '';
    const ext = extension ? `.${extension}` : '';
    return `${base}${timestamp}${ext}`;
  },

  validateFilename: (filename: string): string => {
    // Remove or replace invalid filename characters
    return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
  },
};
