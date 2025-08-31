/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.carbonads.com',
      },
    ],
  },

  // Configure headers for VPN compatibility
  // IMPORTANT: HSTS is COMPLETELY REMOVED for corporate VPN access
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Basic security headers that work with VPNs
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Anti-HSTS headers to clear browser cache
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          // VPN compatibility indicator
          {
            key: 'X-VPN-Compatible',
            value: 'true',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Configure based on your needs
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Redirects for common patterns
  async redirects() {
    return [
      // Add tool aliases
      {
        source: '/json',
        destination: '/tools/json-formatter',
        permanent: true,
      },
      {
        source: '/jwt',
        destination: '/tools/jwt-decoder',
        permanent: true,
      },
      {
        source: '/base64',
        destination: '/tools/base64',
        permanent: true,
      },
    ];
  },

  // Configure webpack for Web Workers and optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    } else {
      // Server-side optimizations for smaller serverless functions
      // Note: usedExports conflicts with Next.js caching, so we use other optimizations

      // Exclude heavy dependencies from serverless bundles
      config.externals = [
        ...(config.externals || []),
        {
          '@next/bundle-analyzer': 'commonjs @next/bundle-analyzer',
          sharp: 'commonjs sharp',
        },
      ];
    }

    // Add worker-loader for Web Workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          publicPath: '/_next/',
          filename: 'static/[hash].worker.js',
        },
      },
    });

    // Optimize bundle splitting with better stability
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxInitialRequests: 10, // Further reduced for smaller initial bundles
        maxAsyncRequests: 10, // Further reduced for smaller initial bundles
        minSize: 30000, // Increased to create fewer, larger chunks
        maxSize: 100000, // Enforce maximum chunk size
        cacheGroups: {
          // Essential framework chunks - small and critical
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            enforce: true,
            maxSize: 80000,
          },
          // UI libraries - include in initial bundle to ensure proper hook context
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'initial', // Use initial to ensure it's loaded with the main app
            priority: 30,
            enforce: true,
            maxSize: 120000, // Increased size for full library
          },
          // Icon libraries - separate and async
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-icons',
            chunks: 'async',
            priority: 25,
            enforce: true,
            maxSize: 40000,
          },
          // Utilities and smaller libs
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 20,
            minChunks: 1,
            maxSize: 80000,
          },
          // Application code - very small chunks
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 60000,
          },
        },
      };

      // Let Next.js handle React resolution naturally to avoid conflicts

      // Add retry logic for failed chunk loading
      config.output = {
        ...config.output,
        chunkLoadTimeout: 30000, // 30 seconds
      };
    }

    return config;
  },

  // Transpile packages for better optimization
  transpilePackages: ['framer-motion'],

  // Experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Enable server components for better performance
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable aggressive tree shaking
    optimizeServerReact: true,
    // Reduce serverless function size
    serverMinification: true,
  },

  // Reduce bundle size by excluding heavy dependencies from server build
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},

  // Compress output
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Standalone output disabled temporarily due to cache issues
  // output: 'standalone',

  // Generate sitemap
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
