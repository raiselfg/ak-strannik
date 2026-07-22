import { Prisma, prisma } from '@ak-strannik/database';
type ConcertListItem = Prisma.ConcertContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type RecordWithTranslations = Prisma.ConcertContentGetPayload<{
  include: { translations: true };
}>;
export async function getConcertContents(): Promise<ConcertListItem[]> {
  return prisma.concertContent.findMany({
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
export async function getConcertContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.concertContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
