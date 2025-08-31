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

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate framer-motion into its own chunk
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 30,
          },
          // Separate React into its own chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          // Other vendor dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 200000, // 200KB
          },
          common: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
            maxSize: 100000, // 100KB
          },
        },
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
