import { ImageResponse } from 'next/og';
import React from 'react';

export interface FallbackImageOptions {
  title: string;
  description?: string;
  icon?: string;
  width?: number;
  height?: number;
  type?: 'homepage' | 'tool' | 'error';
}

export async function generateFallbackImage({
  title,
  description,
  icon = '🧪',
  width = 1200,
  height = 630,
  type = 'error',
}: FallbackImageOptions): Promise<ImageResponse> {
  // Color schemes based on type
  const colorSchemes = {
    homepage: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: 'rgba(255, 255, 255, 0.15)',
    },
    tool: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: 'rgba(255, 255, 255, 0.15)',
    },
    error: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: 'rgba(255, 255, 255, 0.15)',
    },
  };

  const colors = colorSchemes[type];

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          fontFamily: 'system-ui',
          position: 'relative',
        },
      },
      // Background Pattern
      React.createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2px, transparent 0)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.7,
        },
      }),
      // Main Content
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            gap: '24px',
            maxWidth: '800px',
            padding: '0 60px',
          },
        },
        // Icon
        React.createElement(
          'div',
          {
            style: {
              fontSize: '120px',
              marginBottom: '8px',
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
            },
          },
          icon
        ),
        // Title
        React.createElement(
          'div',
          {
            style: {
              fontSize: title.length > 30 ? '48px' : '64px',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              marginBottom: description ? '16px' : '32px',
              letterSpacing: '-1px',
              lineHeight: '1.1',
            },
          },
          title
        ),
        // Description (conditional)
        description &&
          React.createElement(
            'div',
            {
              style: {
                fontSize: '24px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                lineHeight: '1.3',
                marginBottom: '32px',
              },
            },
            description
          ),
        // ToolsLab Branding
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: colors.accent,
              backdropFilter: 'blur(10px)',
              padding: '16px 24px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            },
          },
          React.createElement('div', { style: { fontSize: '32px' } }, '🧪'),
          React.createElement(
            'div',
            {
              style: {
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
              },
            },
            'ToolsLab'
          )
        ),
        // Bottom Features (conditional)
        type !== 'error' &&
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
                marginTop: '16px',
              },
            },
            React.createElement(
              'div',
              {
                style: { display: 'flex', alignItems: 'center', gap: '8px' },
              },
              React.createElement('div', null, '🚀'),
              React.createElement('div', null, 'Fast & Free')
            ),
            React.createElement(
              'div',
              {
                style: { display: 'flex', alignItems: 'center', gap: '8px' },
              },
              React.createElement('div', null, '🔒'),
              React.createElement('div', null, 'Secure')
            ),
            React.createElement(
              'div',
              {
                style: { display: 'flex', alignItems: 'center', gap: '8px' },
              },
              React.createElement('div', null, '📱'),
              React.createElement('div', null, 'Works Offline')
            )
          )
      ),
      // Decorative Elements
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        },
      }),
      React.createElement('div', {
        style: {
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        },
      })
    ),
    {
      width,
      height,
    }
  );
}

// Utility function to generate static fallback images for deployment
export async function generateStaticFallbackImages() {
  const fallbackImages = [
    {
      filename: 'fallback-homepage.png',
      options: {
        title: 'ToolsLab',
        description: 'Laboratory for Developer Tools',
        type: 'homepage' as const,
      },
    },
    {
      filename: 'fallback-tool.png',
      options: {
        title: 'Developer Tool',
        description: 'Free Online Tool - ToolsLab',
        type: 'tool' as const,
      },
    },
    {
      filename: 'fallback-error.png',
      options: {
        title: 'Page Not Found',
        description: 'ToolsLab - Developer Tools',
        icon: '❌',
        type: 'error' as const,
      },
    },
  ];

  return Promise.all(
    fallbackImages.map(async (img) => ({
      filename: img.filename,
      imageResponse: await generateFallbackImage(img.options),
    }))
  );
}

// Error boundary for OG image generation
export function createOGImageErrorBoundary(
  fallbackTitle: string,
  fallbackDescription?: string,
  type: 'homepage' | 'tool' | 'error' = 'error'
) {
  return async (error: Error) => {
    console.error('OG Image generation failed:', error);

    return generateFallbackImage({
      title: fallbackTitle,
      description:
        fallbackDescription || 'Something went wrong generating the image',
      type,
      icon: type === 'error' ? '⚠️' : '🧪',
    });
  };
}
