import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { PartnerFormValues } from './schema';

export async function getPartners() {
  const partners = await prisma.partner.findMany({
    select: {
      id: true,
      logoId: true,
      logo: { select: { originalName: true, objectKey: true } },
      websiteUrl: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        select: { locale: true, name: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
      _count: { select: { media: true, videos: true } },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return partners.map((partner) => ({
    ...partner,
    logo: partner.logo
      ? {
          ...partner.logo,
          publicUrl: getMediaPublicUrl(partner.logo.objectKey),
        }
      : null,
  }));
}

export async function getPartnerById(id: string) {
  if (!isUuid(id)) return null;
  const partner = await prisma.partner.findUnique({
    where: { id },
    select: {
      id: true,
      logoId: true,
      websiteUrl: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: { locale: true, name: true, description: true },
      },
      media: {
        select: { mediaId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
      videos: {
        select: { provider: true, url: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!partner) return null;
  const ru = partner.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = partner.translations.find(
    (translation) => translation.locale === 'en'
  );
  const defaultValues: PartnerFormValues = {
    logoId: partner.logoId,
    websiteUrl: partner.websiteUrl,
    sortOrder: partner.sortOrder,
    isActive: partner.isActive,
    media: partner.media.map((item, index) => ({
      mediaId: item.mediaId,
      sortOrder: index,
    })),
    videos: partner.videos.map((item, index) => ({
      ...item,
      sortOrder: index,
    })),
    translations: {
      ru: { name: ru?.name ?? '', description: ru?.description ?? null },
      en: { name: en?.name ?? '', description: en?.description ?? null },
    },
  };

  return { id: partner.id, defaultValues };
}
