import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { ContentStatusValue } from './constants';
import type { EventFormValues } from './schema';

export async function getEvents(filters?: { status?: ContentStatusValue }) {
  const events = await prisma.event.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    select: {
      id: true, slug: true, status: true, eventDate: true, sortOrder: true,
      createdAt: true, updatedAt: true,
      coverImage: { select: { originalName: true, objectKey: true } },
      translations: {
        select: { locale: true, title: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
      _count: { select: { images: true } },
    },
    orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }, { createdAt: 'desc' }],
  });
  return events.map((event) => ({
    ...event,
    coverImage: event.coverImage
      ? { ...event.coverImage, publicUrl: getMediaPublicUrl(event.coverImage.objectKey) }
      : null,
  }));
}

export async function getEventById(id: string) {
  if (!isUuid(id)) return null;
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true, slug: true, status: true, eventDate: true, coverImageId: true,
      youtubeUrl: true, sortOrder: true, publishedAt: true,
      translations: {
        select: {
          locale: true, title: true, excerpt: true, body: true,
          seoTitle: true, seoDescription: true,
        },
      },
      images: {
        select: { mediaId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  if (!event) return null;
  const ru = event.translations.find((item) => item.locale === 'ru');
  const en = event.translations.find((item) => item.locale === 'en');
  const empty = { title: '', excerpt: null, body: null, seoTitle: null, seoDescription: null };
  const defaultValues: EventFormValues = {
    slug: event.slug,
    status: event.status,
    eventDate: event.eventDate,
    coverImageId: event.coverImageId,
    youtubeUrl: event.youtubeUrl,
    sortOrder: event.sortOrder,
    publishedAt: event.publishedAt,
    translations: {
      ru: ru ? { title: ru.title, excerpt: ru.excerpt, body: ru.body, seoTitle: ru.seoTitle, seoDescription: ru.seoDescription } : { ...empty },
      en: en ? { title: en.title, excerpt: en.excerpt, body: en.body, seoTitle: en.seoTitle, seoDescription: en.seoDescription } : { ...empty },
    },
    gallery: event.images.map((image, index) => ({ mediaId: image.mediaId, sortOrder: index })),
  };
  return { id: event.id, defaultValues };
}

export async function getEventMediaOptions() {
  const assets = await prisma.mediaAsset.findMany({
    where: { mimeType: { startsWith: 'image/' } },
    select: {
      id: true, originalName: true, objectKey: true,
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
