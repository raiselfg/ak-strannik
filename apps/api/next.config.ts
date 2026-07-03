import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ak-strannik/database'],
  output: 'standalone',
};

export default nextConfig;
