/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "chart.js",
      "@tremor/react",
    ],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  webpack: (config, { isServer }) => {
    // Force splitting into smaller chunks
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 20000000, // 20MB to be safe
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: "framework",
          chunks: "all",
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
          priority: 40,
          enforce: true,
        },
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          priority: 20,
        },
        mui: {
          name: "mui",
          chunks: "all",
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          priority: 30,
        },
        tremor: {
          name: "tremor",
          chunks: "all",
          test: /[\\/]node_modules[\\/]@tremor[\\/]/,
          priority: 30,
        },
        lib: {
          name: (module) => {
            const moduleName =
              module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1] || "lib";
            return `lib-${moduleName.replace("@", "")}`;
          },
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 15,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;
