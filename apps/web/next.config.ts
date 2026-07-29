import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ['image/avif'],
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.ak-strannik.ru',
      },
    ],
  },
  transpilePackages: [
    '@ak-strannik/ui',
    '@ak-strannik/database',
    '@ak-strannik/types',
  ],
  output: 'standalone',
};

export default withNextIntl(nextConfig);
