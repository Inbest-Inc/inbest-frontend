/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Changed from 'standalone' to 'export'
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize the bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };

    return config;
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Add this if you're using API routes
  // rewrites: async () => [],
};

module.exports = nextConfig;
