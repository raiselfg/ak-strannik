import process from 'node:process';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as {
  akStrannikPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.akStrannikPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.akStrannikPrisma = prisma;
}
