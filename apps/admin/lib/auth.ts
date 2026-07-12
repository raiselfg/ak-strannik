import { prisma } from '@ak-strannik/database';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';

import { env } from './env';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 64,
    // Accounts are provisioned out of band; public registration would grant
    // administrative access to an untrusted user.
    disableSignUp: true,
  },
  trustedOrigins: [
    'https://admin.ak-strannik.ru',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  session: {
    expiresIn: 604800, // 7 дней
    updateAge: 86400, // обновлять каждые 24 часа
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 минут кэша
    },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === 'production',
    cookiePrefix: 'strannik_auth',
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  },
  plugins: [nextCookies()],
});
