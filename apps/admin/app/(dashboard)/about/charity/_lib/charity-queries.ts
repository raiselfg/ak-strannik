import { Prisma, prisma } from '@ak-strannik/database';

type CharityListItem = Prisma.CharityContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type CharityWithTranslations = Prisma.CharityContentGetPayload<{
  include: { translations: true };
}>;

export async function getCharityContents(): Promise<CharityListItem[]> {
  return prisma.charityContent.findMany({
    select: {
      id: true,
      images: true,
      translations: {
        where: { locale: 'ru' },
        select: { locale: true, title: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}

export async function getCharityContent(
  id: string
): Promise<CharityWithTranslations | null> {
  return prisma.charityContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
