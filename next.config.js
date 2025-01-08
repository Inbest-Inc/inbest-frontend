/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["@tremor/react"],
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
