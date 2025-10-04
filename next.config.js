/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANTE: Disabilita features sperimentali che causano problemi di cache
  experimental: {
    optimizeCss: true,
  },

  // Disable static export for now - use dev mode for Tauri
  // TODO: Configure proper static export for Tauri production builds

  // Forza pulizia della directory di build
  cleanDistDir: true,
  distDir: '.next',

  // Disabilita features che possono creare problemi di cache
  generateEtags: false,
  poweredByHeader: false,
  compress: true,

  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Ottimizzazioni
  swcMinify: true,
  productionBrowserSourceMaps: false,

  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },

  // Webpack config per escludere file problematici
  webpack: (config, { isServer, dev }) => {
    // Ignora file di cache
    config.module.rules.push({
      test: /\.tsbuildinfo$/,
      loader: 'ignore-loader',
    });

    // Non generare source maps in produzione
    if (!dev) {
      config.devtool = false;
    }

    // Ensure proper module resolution for Vercel
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@'] = require('path').resolve(__dirname);

    return config;
  },

  // Redirects da www a non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.toolslab.dev',
          },
        ],
        destination: 'https://toolslab.dev/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },

  // Headers personalizzati
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      // Compression headers for dictionary API
      {
        source: '/api/dictionary/:locale',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Static dictionary files (if served directly)
      {
        source: '/dictionaries/:locale/:section.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
