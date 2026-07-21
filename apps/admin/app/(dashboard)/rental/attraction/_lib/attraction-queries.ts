import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.AttractionContentGetPayload<{
  include: { translations: true };
}>;
export async function getAttractionContents(): Promise<
  RecordWithTranslations[]
> {
  return prisma.attractionContent.findMany({
    include: { translations: true },
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
