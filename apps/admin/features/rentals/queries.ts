import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { RentalItemFormValues } from './schema';

export async function getRentalItems() {
  const items = await prisma.rentalItem.findMany({
    select: {
      id: true,
      slug: true,
      type: true,
      imageId: true,
      image: { select: { originalName: true, objectKey: true } },
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        select: { locale: true, title: true, priceText: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return items.map((item) => ({
    ...item,
    image: item.image
      ? { ...item.image, publicUrl: getMediaPublicUrl(item.image.objectKey) }
      : null,
  }));
}

export async function getRentalItemById(id: string) {
  if (!isUuid(id)) return null;
  const item = await prisma.rentalItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      type: true,
      imageId: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: { locale: true, title: true, description: true, priceText: true },
      },
    },
  });

  if (!item) return null;
  const ru = item.translations.find((translation) => translation.locale === 'ru');
  const en = item.translations.find((translation) => translation.locale === 'en');
  const defaultValues: RentalItemFormValues = {
    slug: item.slug,
    type: item.type,
    imageId: item.imageId,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    translations: {
      ru: {
        title: ru?.title ?? '',
        description: ru?.description ?? null,
        priceText: ru?.priceText ?? null,
      },
      en: {
        title: en?.title ?? '',
        description: en?.description ?? null,
        priceText: en?.priceText ?? null,
      },
    },
  };

  return { id: item.id, defaultValues };
}

export async function getRentalMediaOptions() {
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
