import { Prisma, prisma } from '@ak-strannik/database';

export type PryalochkaOfTimeSingletonRecord =
  Prisma.PryalochkaOfTimeContentGetPayload<{
    include: {
      events: {
        include: { translations: true };
        orderBy: { position: 'asc' };
      };
      actors: {
        include: { translations: true };
        orderBy: { position: 'asc' };
      };
    };
  }>;

export function getPryalochkaOfTimeSingletonRecords(): Promise<
  PryalochkaOfTimeSingletonRecord[]
> {
  return prisma.pryalochkaOfTimeContent.findMany({
    take: 2,
    orderBy: { createdAt: 'asc' },
    include: {
      events: {
        orderBy: { position: 'asc' },
        include: { translations: true },
      },
      actors: {
        orderBy: { position: 'asc' },
        include: { translations: true },
      },
    },
  });
}
