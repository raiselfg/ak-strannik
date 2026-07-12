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
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return partners.map((partner) => ({
    ...partner,
    logo: partner.logo
      ? { ...partner.logo, publicUrl: getMediaPublicUrl(partner.logo.objectKey) }
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
    },
  });

  if (!partner) return null;
  const ru = partner.translations.find((translation) => translation.locale === 'ru');
  const en = partner.translations.find((translation) => translation.locale === 'en');
  const defaultValues: PartnerFormValues = {
    logoId: partner.logoId,
    websiteUrl: partner.websiteUrl,
    sortOrder: partner.sortOrder,
    isActive: partner.isActive,
    translations: {
      ru: { name: ru?.name ?? '', description: ru?.description ?? null },
      en: { name: en?.name ?? '', description: en?.description ?? null },
    },
  };

  return { id: partner.id, defaultValues };
}

export async function getPartnerMediaOptions() {
  const assets = await prisma.mediaAsset.findMany({
    where: { mimeType: { startsWith: 'image/' } },
    select: {
      id: true,
      originalName: true,
      objectKey: true,
      translations: {
        where: { locale: { in: ['ru', 'en'] } },
        select: { locale: true, alt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return assets.map((asset) => ({
    id: asset.id,
    originalName: asset.originalName,
    publicUrl: getMediaPublicUrl(asset.objectKey),
    alt: asset.translations.find((item) => item.locale === 'ru')?.alt
      ?? asset.translations.find((item) => item.locale === 'en')?.alt
      ?? asset.originalName,
  }));
}
