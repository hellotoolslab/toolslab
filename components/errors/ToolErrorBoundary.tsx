'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';
import { ERRORS } from '@/lib/constants/tools';

interface Props {
  children: ReactNode;
  toolName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Error Boundary specifically designed for tool components
 * Provides graceful error handling and recovery options
 */
export class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error(`Tool Error [${this.props.toolName || 'Unknown'}]:`, error);
    console.error('Error Info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to analytics (if available)
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('tool-error', {
        tool: this.props.toolName,
        error: error.message,
        stack: error.stack?.split('\n')[0],
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
          <div className="mb-6">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">
            Tool Error Occurred
          </h2>

          <p className="mb-6 max-w-md text-sm text-red-600 dark:text-red-300">
            {this.props.toolName ? (
              <>
                The <strong>{this.props.toolName}</strong> tool encountered an
                unexpected error.
              </>
            ) : (
              'This tool encountered an unexpected error.'
            )}
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 w-full max-w-2xl">
              <summary className="cursor-pointer text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-300">
                <Bug className="mr-1 inline h-4 w-4" />
                Error Details (Development)
              </summary>
              <div className="mt-2 rounded border bg-red-100 p-3 text-left font-mono text-xs dark:bg-red-900/30">
                <div className="mb-2 text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div className="text-red-700 dark:text-red-300">
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo && (
                  <div className="mt-2 text-red-700 dark:text-red-300">
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Recovery actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>

            <a
              href="/"
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Home className="h-4 w-4" />
              Go Home
            </a>
          </div>

          {/* Error ID for support */}
          <div className="mt-6 text-xs text-red-500">
            Error ID: {this.state.errorId}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC wrapper for easier usage
 */
export function withToolErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  toolName: string
) {
  const WrappedComponent = (props: P) => (
    <ToolErrorBoundary toolName={toolName}>
      <Component {...props} />
    </ToolErrorBoundary>
  );

  WrappedComponent.displayName = `withToolErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for programmatic error reporting
 */
export function useErrorReporting(toolName: string) {
  const reportError = React.useCallback(
    (error: Error, context?: string) => {
      console.error(
        `Tool Error [${toolName}]${context ? ` - ${context}` : ''}:`,
        error
      );

      // Report to analytics
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('tool-error', {
          tool: toolName,
          context,
          error: error.message,
        });
      }
    },
    [toolName]
  );

  return { reportError };
}
