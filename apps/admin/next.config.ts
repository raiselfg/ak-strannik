import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents:true,
  transpilePackages: ['@ak-strannik/ui', '@ak-strannik/database'],
  output: 'standalone',
};

export default nextConfig;
