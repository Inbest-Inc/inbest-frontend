/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  images: {
    unoptimized: true,
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Optimize both client and server bundles
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [...(config.optimization.minimizer || [])],
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        maxSize: 10 * 1024 * 1024, // 10MB max chunk size
        cacheGroups: {
          default: false,
          vendors: false,
          // Small packages
          smallVendors: {
            name: "smallVendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 20,
            enforce: true,
            maxSize: 5 * 1024 * 1024, // 5MB
          },
          // Core framework
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|next|@next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Larger UI libraries
          ui: {
            name: "ui",
            test: /[\\/]node_modules[\\/](@tremor|framer-motion|chart\.js)[\\/]/,
            priority: 30,
            enforce: true,
            maxSize: 5 * 1024 * 1024, // 5MB
          },
          // Reused code
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 5 * 1024 * 1024, // 5MB
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
