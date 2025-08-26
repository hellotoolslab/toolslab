'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        // Success
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            background: '#059669',
            color: '#fff',
          },
        },
        // Error
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            background: '#DC2626',
            color: '#fff',
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: '#8B5CF6',
            secondary: '#fff',
          },
          style: {
            background: '#7C3AED',
            color: '#fff',
          },
        },
      }}
    />
  );
}
