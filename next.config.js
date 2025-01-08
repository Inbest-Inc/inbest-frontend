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
  experimental: {
    webpackBuildWorker: false,
    turbotrace: {
      memoryLimit: 4096,
    },
  },
  webpack: (config) => {
    // Disable webpack caching
    config.cache = false;

    // Configure chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 20000000, // 20MB
        cacheGroups: {
          default: false,
          vendors: false,
          pages: {
            test: /[\\/]pages[\\/]/,
            name: "pages",
            chunks: "all",
            maxSize: 20000000,
          },
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2,
            maxSize: 20000000,
          },
        },
      },
      runtimeChunk: { name: "runtime" },
    };

    return config;
  },
};

module.exports = nextConfig;
