import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.MasterclassesContentGetPayload<{
  include: { translations: true };
}>;
export async function getMasterclassesContents(): Promise<
  RecordWithTranslations[]
> {
  return prisma.masterclassesContent.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getMasterclassesContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.masterclassesContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
