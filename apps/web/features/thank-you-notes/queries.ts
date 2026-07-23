import 'server-only';

import { Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

const thankYouNoteSelect = {
  id: true,
  image: true,
} satisfies Prisma.ThankYouNoteContentSelect;

export type PublicThankYouNote = Prisma.ThankYouNoteContentGetPayload<{
  select: typeof thankYouNoteSelect;
}>;

export async function getLatestThankYouNotes(): Promise<PublicThankYouNote[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  return prisma.thankYouNoteContent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: thankYouNoteSelect,
  });
}
