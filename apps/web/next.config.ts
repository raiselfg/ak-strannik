import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@strannik/ui"],
  reactCompiler: true,
  images: {
    formats: ["image/avif"],
    qualities: [50, 75],
  },
};

export default nextConfig;
