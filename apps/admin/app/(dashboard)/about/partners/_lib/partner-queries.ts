import { Prisma, prisma } from '@ak-strannik/database';

type PartnerListItem = Prisma.PartnerContentGetPayload<{
  select: {
    id: true;
    images: true;
    link: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type PartnerWithTranslations = Prisma.PartnerContentGetPayload<{
  include: { translations: true };
}>;

export async function getPartnerContents(): Promise<PartnerListItem[]> {
  return prisma.partnerContent.findMany({
    select: {
      id: true,
      images: true,
      link: true,
      translations: {
        where: { locale: 'ru' },
        select: { locale: true, title: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}

export async function getPartnerContent(
  id: string
): Promise<PartnerWithTranslations | null> {
  return prisma.partnerContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
