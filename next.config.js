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
  webpack: (config) => {
    config.cache = false; // Disable webpack caching
    config.optimization = {
      minimize: true,
      moduleIds: "deterministic",
      chunkIds: "deterministic",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 50,
        minSize: 0,
        maxSize: 5 * 1024 * 1024, // 5MB max chunk size
        cacheGroups: {
          // Break up node_modules
          vendor: {
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            maxSize: 5 * 1024 * 1024,
            minSize: 0,
            minChunks: 1,
            enforce: true,
            reuseExistingChunk: true,
            name(module) {
              // Extract package name
              const match = module.context?.match(
                /[\\/]node_modules[\\/](.*?)(?:[\\/]|$)/
              );
              const name = match?.[1]?.replace("@", "");
              return name ? `vendor-${name}` : "vendor";
            },
          },
          // Separate chunk for each page
          pages: {
            name: "pages",
            test: /[\\/]pages[\\/]/,
            chunks: "all",
            maxSize: 5 * 1024 * 1024,
            priority: -20,
          },
          // Components as separate chunks
          components: {
            name: "components",
            test: /[\\/]components[\\/]/,
            chunks: "all",
            maxSize: 5 * 1024 * 1024,
            priority: -30,
          },
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;
