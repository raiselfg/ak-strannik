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
      _count: { select: { images: true } },
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
        select: {
          locale: true,
          title: true,
          description: true,
          priceText: true,
        },
      },
      images: {
        select: { mediaId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!item) return null;
  const ru = item.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = item.translations.find(
    (translation) => translation.locale === 'en'
  );
  const defaultValues: RentalItemFormValues = {
    slug: item.slug,
    type: item.type,
    imageId: item.imageId,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    gallery: item.images.map((image, index) => ({
      mediaId: image.mediaId,
      sortOrder: index,
    })),
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
