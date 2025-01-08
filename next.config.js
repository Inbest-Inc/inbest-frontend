/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 24000000, // 24MB to stay safely under 25MB limit
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: "all",
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            chunks: "all",
            name: "commons",
            minChunks: 2,
            priority: 20,
          },
          lib: {
            chunks: "all",
            name: "lib",
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
          },
          components: {
            chunks: "all",
            name: "components",
            test: /[\\/]components[\\/]/,
            priority: 10,
          },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true,
            priority: 50,
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
