import { Locale, Prisma, prisma } from '@ak-strannik/database';

export type PerformancesListItem = Prisma.PerformancesContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
    _count: { select: { persons: true } };
  };
}>;

export type PerformancesContentForEdit = Prisma.PerformancesContentGetPayload<{
  include: {
    translations: true;
    persons: {
      include: { translations: true };
    };
  };
}>;

export function getPerformancesContents(): Promise<PerformancesListItem[]> {
  return prisma.performancesContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      images: true,
      translations: {
        where: { locale: Locale.ru },
        select: { locale: true, title: true },
      },
      _count: { select: { persons: true } },
    },
  });
}

export function getPerformancesContent(
  id: string
): Promise<PerformancesContentForEdit | null> {
  return prisma.performancesContent.findUnique({
    where: { id },
    include: {
      translations: true,
      persons: {
        orderBy: { position: 'asc' },
        include: { translations: true },
      },
    },
  });
}
