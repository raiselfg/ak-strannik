import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: {
    formats: ['image/avif'],
    qualities: [50, 75],
  },
  transpilePackages: ['@ak-strannik/ui'],
  output: 'standalone',
};

export default nextConfig;
