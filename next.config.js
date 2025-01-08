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
  webpack: (config) => {
    // Optimize the bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: "all",
        maxSize: 20000000, // 20MB
        minSize: 10000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
            chunks: "all",
          },
          // Library chunk
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            chunks: "all",
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `lib.${packageName.replace("@", "")}`;
            },
          },
          // Components chunk
          components: {
            name: "components",
            test: /[\\/]components[\\/]/,
            priority: 20,
            chunks: "all",
          },
        },
      },
    };

    return config;
  },
  transpilePackages: ["@tremor/react"],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
