/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@tremor/react"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "./src"),
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG || "false",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  output: "standalone",
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
