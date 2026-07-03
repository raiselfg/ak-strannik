import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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

export default withNextIntl(nextConfig);
