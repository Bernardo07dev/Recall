import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 104857600, // 100 MB
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
