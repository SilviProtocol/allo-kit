import type { NextConfig } from "next";

import path from "path";
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  devIndicators: false,
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.resolve.alias = {
      ...config.resolve.alias,
      // Temporary fix to resolve these in nextjs package correctly (it works with next dev --turbopack)
      "~~": path.resolve("../nextjs/"),
    };
    return config;
  },
};

export default nextConfig;
