import { Prisma, prisma } from '@ak-strannik/database';
type MasterclassesListItem = Prisma.MasterclassesContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type RecordWithTranslations = Prisma.MasterclassesContentGetPayload<{
  include: { translations: true };
}>;
export async function getMasterclassesContents(): Promise<
  MasterclassesListItem[]
> {
  return prisma.masterclassesContent.findMany({
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
export async function getMasterclassesContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.masterclassesContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
