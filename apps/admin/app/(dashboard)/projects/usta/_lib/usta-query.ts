import { Prisma, prisma } from '@ak-strannik/database';

export type UstaSingletonRecord = Prisma.UstaContentGetPayload<{
  include: { translations: true };
}>;

export function getUstaSingletonRecords(): Promise<UstaSingletonRecord[]> {
  return prisma.ustaContent.findMany({
    orderBy: { createdAt: 'asc' },
    take: 2,
    include: { translations: true },
  });
}
