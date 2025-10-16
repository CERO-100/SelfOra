import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow production builds to succeed even if ESLint errors are present.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
