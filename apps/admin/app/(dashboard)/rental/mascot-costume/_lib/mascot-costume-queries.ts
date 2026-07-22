import { Prisma, prisma } from '@ak-strannik/database';
type MascotCostumeListItem = Prisma.MascotCostumeContentGetPayload<{
  select: {
    id: true;
    image: true;
    translations: { select: { locale: true; text: true } };
  };
}>;
type RecordWithTranslations = Prisma.MascotCostumeContentGetPayload<{
  include: { translations: true };
}>;
export async function getMascotCostumeContents(): Promise<
  MascotCostumeListItem[]
> {
  return prisma.mascotCostumeContent.findMany({
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
export async function getMascotCostumeContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.mascotCostumeContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
