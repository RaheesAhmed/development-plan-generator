import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disables type checking during the build
    ignoreBuildErrors: true,
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable source maps
  productionBrowserSourceMaps: false,
  // Disable strict mode if needed
  reactStrictMode: false,
};

export default nextConfig;
