import { Prisma, prisma } from '@ak-strannik/database';

type ArtistListItem = Prisma.ArtistContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type ArtistWithTranslations = Prisma.ArtistContentGetPayload<{
  include: { translations: true };
}>;

export async function getArtistContents(): Promise<ArtistListItem[]> {
  return prisma.artistContent.findMany({
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

export async function getArtistContent(
  id: string
): Promise<ArtistWithTranslations | null> {
  return prisma.artistContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
