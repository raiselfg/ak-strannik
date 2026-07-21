import { Prisma, prisma } from '@ak-strannik/database';

type ArtistWithTranslations = Prisma.ArtistContentGetPayload<{
  include: { translations: true };
}>;

export async function getArtistContents(): Promise<ArtistWithTranslations[]> {
  return prisma.artistContent.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}

export async function getArtistContent(
  id: string
): Promise<ArtistWithTranslations | null> {
  return prisma.artistContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
