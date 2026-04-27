import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false, // or disable turbopack css optimization
  },
};

export default nextConfig;

