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
        maxInitialRequests: 15, // Reduced for stability
        maxAsyncRequests: 15, // Reduced for stability
        minSize: 20000,
        cacheGroups: {
          // Essential framework chunks
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          // UI libraries
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async', // Only async to prevent blocking
            priority: 30,
            enforce: true,
          },
          // Utilities and smaller libs
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 20,
            minChunks: 1,
            maxSize: 180000,
          },
          // Application code
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 120000,
          },
        },
      };

      // Ensure proper module resolution - React aliases removed to prevent conflicts

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
  },

  // Reduce bundle size by excluding heavy dependencies from server build
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},

  // Compress output
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

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
