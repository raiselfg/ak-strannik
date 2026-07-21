import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.MascotCostumeContentGetPayload<{
  include: { translations: true };
}>;
export async function getMascotCostumeContents(): Promise<
  RecordWithTranslations[]
> {
  return prisma.mascotCostumeContent.findMany({
    include: { translations: true },
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
