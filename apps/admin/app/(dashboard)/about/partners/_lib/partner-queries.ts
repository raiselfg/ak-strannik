import { Prisma, prisma } from '@ak-strannik/database';

type PartnerWithTranslations = Prisma.PartnerContentGetPayload<{
  include: { translations: true };
}>;

export async function getPartnerContents(): Promise<PartnerWithTranslations[]> {
  return prisma.partnerContent.findMany({
    include: { translations: true },
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
