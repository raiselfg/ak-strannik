import { Prisma, prisma } from '@ak-strannik/database';

type CharityWithTranslations = Prisma.CharityContentGetPayload<{
  include: { translations: true };
}>;

export async function getCharityContents(): Promise<CharityWithTranslations[]> {
  return prisma.charityContent.findMany({
    include: { translations: true },
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
