import { Locale, Prisma, prisma } from '@ak-strannik/database';

export type FestivalListItem = Prisma.FestivalContentGetPayload<{
  select: {
    id: true;
    logo: true;
    slug: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;

export type FestivalContentForEdit = Prisma.FestivalContentGetPayload<{
  include: {
    translations: true;
    events: { include: { translations: true } };
    nominations: { include: { translations: true } };
    jury: {
      include: {
        translations: true;
        persons: { include: { translations: true } };
      };
    };
    organizations: {
      include: {
        translations: true;
        organizations: { include: { translations: true } };
      };
    };
  };
}>;

export function getFestivalContents(): Promise<FestivalListItem[]> {
  return prisma.festivalContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      logo: true,
      slug: true,
      images: true,
      translations: {
        where: { locale: Locale.ru },
        select: { locale: true, title: true },
      },
    },
  });
}

export function getFestivalContent(
  id: string
): Promise<FestivalContentForEdit | null> {
  return prisma.festivalContent.findUnique({
    where: { id },
    include: {
      translations: true,
      events: {
        orderBy: { position: 'asc' },
        include: { translations: true },
      },
      nominations: { include: { translations: true } },
      jury: {
        include: {
          translations: true,
          persons: {
            orderBy: { position: 'asc' },
            include: { translations: true },
          },
        },
      },
      organizations: {
        include: {
          translations: true,
          organizations: {
            orderBy: { position: 'asc' },
            include: { translations: true },
          },
        },
      },
    },
  });
}
