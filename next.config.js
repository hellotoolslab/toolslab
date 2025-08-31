/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANTE: Disabilita features sperimentali che causano problemi di cache
  experimental: {
    optimizeCss: true,
  },

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

    return config;
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
    ];
  },
};

module.exports = nextConfig;
