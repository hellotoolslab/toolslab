'use client';

import { useState, useEffect } from 'react';
import { Download, X, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UpdatePayload {
  message: string;
  version: string;
}

interface UpdateNotificationProps {
  className?: string;
}

export function UpdateNotification({ className }: UpdateNotificationProps) {
  const [updateAvailable, setUpdateAvailable] = useState<UpdatePayload | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTauriApp, setIsTauriApp] = useState(false);

  useEffect(() => {
    // Check if we're running in Tauri
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      setIsTauriApp(true);

      const { invoke } = (window as any).__TAURI__.core;
      const { listen } = (window as any).__TAURI__.event;

      // Listen for update events from Rust backend
      const unlistenUpdateAvailable = listen(
        'update-available',
        (event: any) => {
          const payload = event.payload as UpdatePayload;
          setUpdateAvailable(payload);
          setIsVisible(true);

          // Show toast notification
          toast.info(`Update available: ${payload.version}`, {
            description: 'A new version of ToolsLab is ready to download.',
            action: {
              label: 'Update Now',
              onClick: () => handleDownloadUpdate(),
            },
          });
        }
      );

      const unlistenDownloadStarted = listen('update-download-started', () => {
        setIsDownloading(true);
        toast.loading('Downloading update...', {
          id: 'download-progress',
        });
      });

      const unlistenDownloadComplete = listen(
        'update-download-complete',
        () => {
          setIsDownloading(false);
          setDownloadComplete(true);
          toast.success('Update downloaded successfully!', {
            id: 'download-progress',
            description: 'ToolsLab will restart to apply the update.',
          });
        }
      );

      // Cleanup listeners
      return () => {
        unlistenUpdateAvailable();
        unlistenDownloadStarted();
        unlistenDownloadComplete();
      };
    }
  }, []);

  const handleCheckForUpdates = async () => {
    if (!isTauriApp) return;

    try {
      const { invoke } = (window as any).__TAURI__.core;
      const result = await invoke('check_for_updates');

      if (result.includes('No updates available')) {
        toast.success('You have the latest version!');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      toast.error('Failed to check for updates');
    }
  };

  const handleDownloadUpdate = async () => {
    if (!updateAvailable || !isTauriApp) return;

    try {
      const { invoke } = (window as any).__TAURI__.core;
      setIsDownloading(true);

      await invoke('download_and_install_update');

      setIsDownloading(false);
      setDownloadComplete(true);
    } catch (error) {
      console.error('Error downloading update:', error);
      setIsDownloading(false);
      toast.error('Failed to download update');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setUpdateAvailable(null);
    setDownloadComplete(false);
  };

  // Don't render if not in Tauri app or not visible
  if (!isTauriApp || !isVisible || !updateAvailable) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-50 w-80 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-lg dark:border-blue-800 dark:bg-blue-950',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {downloadComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : isDownloading ? (
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {downloadComplete
                ? 'Update Ready'
                : isDownloading
                  ? 'Downloading Update'
                  : 'Update Available'}
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              {downloadComplete
                ? 'Update downloaded successfully. ToolsLab will restart to apply changes.'
                : isDownloading
                  ? `Downloading ToolsLab ${updateAvailable.version}...`
                  : `Version ${updateAvailable.version} is now available.`}
            </p>

            {updateAvailable.message && !isDownloading && !downloadComplete && (
              <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                {updateAvailable.message.substring(0, 100)}
                {updateAvailable.message.length > 100 ? '...' : ''}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-md p-1.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {downloadComplete ? (
          <button
            onClick={() => {
              // In a real implementation, you'd restart the app here
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
          >
            <RefreshCw className="h-3 w-3" />
            Restart Now
          </button>
        ) : isDownloading ? (
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
              <div
                className="h-full animate-pulse rounded-full bg-blue-600 dark:bg-blue-400"
                style={{ width: '60%' }}
              ></div>
            </div>
            <span>Downloading...</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleDownloadUpdate}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-3 w-3" />
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              Later
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for manual update checks
export function useUpdateChecker() {
  const [isTauriApp, setIsTauriApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      setIsTauriApp(true);
    }
  }, []);

  const checkForUpdates = async () => {
    if (!isTauriApp) {
      toast.error('Updates are only available in the desktop app');
      return;
    }

    try {
      const { invoke } = (window as any).__TAURI__.core;
      const result = await invoke('check_for_updates');

      if (result.includes('No updates available')) {
        toast.success('You have the latest version!');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      toast.error('Failed to check for updates');
    }
  };

  return { checkForUpdates, isTauriApp };
}
