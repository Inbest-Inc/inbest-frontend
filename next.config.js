/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist",
  trailingSlash: true,
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
  // Handle all routes through client-side navigation
  basePath: "",
  assetPrefix: "",
  skipTrailingSlashRedirect: true,
  // This will handle all routes through index.html
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
