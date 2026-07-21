import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.ExhibitionContentGetPayload<{
  include: { translations: true };
}>;
export async function getExhibitionContents(): Promise<
  RecordWithTranslations[]
> {
  return prisma.exhibitionContent.findMany({
    include: { translations: true },
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
