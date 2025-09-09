import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ToolsLab - Developer Tools Laboratory',
    short_name: 'ToolsLab',
    description:
      'Free online developer tools for JSON formatting, Base64 encoding, JWT decoding, UUID generation, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e293b',
    theme_color: '#8b5cf6',
    orientation: 'portrait-primary',
    categories: ['developer-tools', 'productivity', 'utilities'],
    lang: 'en',
    scope: '/',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'JSON Formatter',
        short_name: 'JSON',
        description: 'Format and validate JSON data',
        url: '/tools/json-formatter',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Base64 Encoder/Decoder',
        short_name: 'Base64',
        description: 'Encode and decode Base64 data',
        url: '/tools/base64-encode',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'JWT Decoder',
        short_name: 'JWT',
        description: 'Decode and inspect JWT tokens',
        url: '/tools/jwt-decoder',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'UUID Generator',
        short_name: 'UUID',
        description: 'Generate various types of UUIDs',
        url: '/tools/uuid-generator',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
