import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { ContentStatusValue } from './constants';
import type { EventFormValues } from './schema';

export async function getEvents(filters?: {
  status?: ContentStatusValue;
  year?: number;
  projectId?: string;
}) {
  const events = await prisma.event.findMany({
    where: {
      status: filters?.status,
      eventYear: filters?.year,
      projectId: filters?.projectId,
    },
    select: {
      id: true,
      slug: true,
      status: true,
      eventYear: true,
      startDate: true,
      endDate: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      project: {
        select: {
          id: true,
          translations: {
            where: { locale: 'ru' },
            select: { title: true },
            take: 1,
          },
        },
      },
      coverImage: { select: { originalName: true, objectKey: true } },
      translations: {
        select: { locale: true, title: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
      _count: { select: { images: true, videos: true } },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { eventYear: 'desc' },
      { startDate: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return events.map((event) => ({
    ...event,
    coverImage: event.coverImage
      ? {
          ...event.coverImage,
          publicUrl: getMediaPublicUrl(event.coverImage.objectKey),
        }
      : null,
  }));
}

export async function getEventFilterOptions() {
  const [yearRows, projects] = await Promise.all([
    prisma.event.findMany({
      where: { eventYear: { not: null } },
      distinct: ['eventYear'],
      select: { eventYear: true },
      orderBy: { eventYear: 'desc' },
    }),
    getEventProjectOptions(),
  ]);
  return {
    years: yearRows.flatMap(({ eventYear }) =>
      eventYear === null ? [] : [eventYear]
    ),
    projects,
  };
}

export async function getEventProjectOptions() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      slug: true,
      translations: {
        where: { locale: { in: ['ru', 'en'] } },
        select: { locale: true, title: true },
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return projects.map((project) => ({
    id: project.id,
    label:
      project.translations.find(({ locale }) => locale === 'ru')?.title ??
      project.translations.find(({ locale }) => locale === 'en')?.title ??
      project.slug,
  }));
}

export async function getEventById(id: string) {
  if (!isUuid(id)) return null;
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      status: true,
      eventYear: true,
      startDate: true,
      endDate: true,
      projectId: true,
      coverImageId: true,
      sortOrder: true,
      publishedAt: true,
      translations: {
        select: {
          locale: true,
          title: true,
          excerpt: true,
          body: true,
          dateText: true,
          locationText: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      images: {
        select: { mediaId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
      videos: {
        select: { provider: true, url: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  if (!event) return null;
  const ru = event.translations.find((item) => item.locale === 'ru');
  const en = event.translations.find((item) => item.locale === 'en');
  const empty = {
    title: '',
    excerpt: null,
    body: null,
    dateText: null,
    locationText: null,
    seoTitle: null,
    seoDescription: null,
  };
  const defaultValues: EventFormValues = {
    slug: event.slug,
    status: event.status,
    eventYear: event.eventYear,
    startDate: event.startDate,
    endDate: event.endDate,
    projectId: event.projectId,
    coverImageId: event.coverImageId,
    sortOrder: event.sortOrder,
    publishedAt: event.publishedAt,
    translations: {
      ru: ru
        ? {
            title: ru.title,
            excerpt: ru.excerpt,
            body: ru.body,
            dateText: ru.dateText,
            locationText: ru.locationText,
            seoTitle: ru.seoTitle,
            seoDescription: ru.seoDescription,
          }
        : { ...empty },
      en: en
        ? {
            title: en.title,
            excerpt: en.excerpt,
            body: en.body,
            dateText: en.dateText,
            locationText: en.locationText,
            seoTitle: en.seoTitle,
            seoDescription: en.seoDescription,
          }
        : { ...empty },
    },
    gallery: event.images.map((image, index) => ({
      mediaId: image.mediaId,
      sortOrder: index,
    })),
    videos: event.videos.map((video, index) => ({
      ...video,
      sortOrder: index,
    })),
  };
  return { id: event.id, defaultValues };
}
