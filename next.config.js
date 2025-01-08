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

    // Set small chunk size
    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 20000000, // 20MB
    };

    return config;
  },
  env: {
    NEXT_RUNTIME: "edge",
  },
};

module.exports = nextConfig;
