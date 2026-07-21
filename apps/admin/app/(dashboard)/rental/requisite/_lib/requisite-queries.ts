import { Locale, Prisma, prisma } from '@ak-strannik/database';

export type RequisiteListItem = Prisma.RequisiteContentGetPayload<{
  select: {
    id: true;
    translations: { select: { locale: true; title: true } };
    requisites: { select: { image: true } };
    _count: { select: { requisites: true } };
  };
}>;

export type RequisiteContentForEdit = Prisma.RequisiteContentGetPayload<{
  include: {
    translations: true;
    requisites: { include: { translations: true } };
  };
}>;

export function getRequisiteContents(): Promise<RequisiteListItem[]> {
  return prisma.requisiteContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      translations: {
        where: { locale: Locale.ru },
        select: { locale: true, title: true },
      },
      requisites: {
        orderBy: { position: 'asc' },
        take: 1,
        select: { image: true },
      },
      _count: { select: { requisites: true } },
    },
  });
}

export function getRequisiteContent(
  id: string
): Promise<RequisiteContentForEdit | null> {
  return prisma.requisiteContent.findUnique({
    where: { id },
    include: {
      translations: true,
      requisites: {
        orderBy: { position: 'asc' },
        include: { translations: true },
      },
    },
  });
}
