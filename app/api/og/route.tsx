// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { tools as staticTools } from '@/data/tools';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const toolSlug = searchParams.get('tool');
    const categorySlug = searchParams.get('category');
    const type = searchParams.get('type') || 'default';

    let title = 'ToolsLab';
    let subtitle = 'Professional Developer Tools';
    let description = 'Free • Instant • Secure';
    let bgGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    let iconPath =
      'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z';

    if (toolSlug) {
      // Tool-specific OG image
      const tool = staticTools.find((t) => t.slug === toolSlug);
      title = tool?.name || formatName(toolSlug);
      subtitle = tool?.description || `Free Online ${title} Tool`;
      description = 'No Signup • Works Offline • Completely Free';

      // Tool-specific gradients based on category
      const categoryGradients: Record<string, string> = {
        text: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        converters: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        generators: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
        security: 'linear-gradient(135deg, #EF4444 0%, #EC4899 100%)',
        formatters: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        css: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
        image: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
        minifiers: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
      };

      bgGradient =
        categoryGradients[tool?.category || ''] ||
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (categorySlug) {
      // Category-specific OG image
      const categoryTools = staticTools.filter(
        (t) => t.category === categorySlug
      );

      title = `${formatName(categorySlug)} Tools`;
      subtitle = `${categoryTools.length} Professional Tools`;
      description = 'Free Collection • No Signup Required';
    } else if (type === 'homepage') {
      // Homepage OG image
      title = 'ToolsLab';
      subtitle = 'Developer Tools That Actually Work';
      description = '35+ Tools • No Signup • Completely Free';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            backgroundImage: bgGradient,
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
            }}
          />

          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 1,
              maxWidth: '900px',
              padding: '0 40px',
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={iconPath} />
              </svg>
              <span
                style={{
                  color: 'white',
                  fontSize: '48px',
                  marginLeft: '20px',
                  fontWeight: 'bold',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                ToolsLab
              </span>
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: toolSlug ? '64px' : '72px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 16px 0',
                lineHeight: 1.1,
                fontFamily: 'system-ui, sans-serif',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 32px 0',
                lineHeight: 1.3,
                fontFamily: 'system-ui, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {subtitle}
            </p>

            {/* Features Row */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                alignItems: 'center',
                fontSize: '24px',
                color: 'white',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: '600',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>⚡</span>
                <span>Instant</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>🔒</span>
                <span>Private</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>✨</span>
                <span>Free</span>
              </div>
            </div>
          </div>

          {/* Bottom URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '20px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            toolslab.dev
          </div>

          {/* Quality Badge */}
          {(toolSlug || categorySlug) && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '12px 24px',
                borderRadius: '25px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'system-ui, sans-serif',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Professional Quality
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);

    // Fallback simple image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a202c',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '72px', fontWeight: 'bold' }}>ToolsLab</h1>
          <p style={{ fontSize: '32px' }}>Professional Developer Tools</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

function formatName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
