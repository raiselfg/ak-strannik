import { Prisma, prisma } from '@ak-strannik/database';
type ExhibitionListItem = Prisma.ExhibitionContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type RecordWithTranslations = Prisma.ExhibitionContentGetPayload<{
  include: { translations: true };
}>;
export async function getExhibitionContents(): Promise<ExhibitionListItem[]> {
  return prisma.exhibitionContent.findMany({
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
export async function getExhibitionContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.exhibitionContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
