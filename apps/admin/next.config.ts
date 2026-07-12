import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  transpilePackages: ['@ak-strannik/ui', '@ak-strannik/database'],
  output: 'standalone',
};

export default nextConfig;
