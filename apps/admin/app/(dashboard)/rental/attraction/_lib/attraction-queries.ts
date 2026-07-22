import { Prisma, prisma } from '@ak-strannik/database';
type AttractionListItem = Prisma.AttractionContentGetPayload<{
  select: {
    id: true;
    image: true;
    translations: { select: { locale: true; text: true } };
  };
}>;
type RecordWithTranslations = Prisma.AttractionContentGetPayload<{
  include: { translations: true };
}>;
export async function getAttractionContents(): Promise<AttractionListItem[]> {
  return prisma.attractionContent.findMany({
    select: {
      id: true,
      image: true,
      translations: {
        where: { locale: 'ru' },
        select: { locale: true, text: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getAttractionContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.attractionContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
