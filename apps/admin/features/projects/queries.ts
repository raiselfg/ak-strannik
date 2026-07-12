import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { ContentStatusValue } from '../events/constants';
import type { ProjectTypeValue } from './constants';
import type { ProjectFormValues } from './schema';

export async function getProjects(filters?: {
  status?: ContentStatusValue;
  type?: ProjectTypeValue;
}) {
  const projects = await prisma.project.findMany({
    where: {
      status: filters?.status,
      type: filters?.type,
    },
    select: {
      id: true, slug: true, type: true, status: true, sortOrder: true,
      publishedAt: true, createdAt: true, updatedAt: true,
      coverImage: { select: { originalName: true, objectKey: true } },
      translations: {
        select: { locale: true, title: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
      _count: { select: { sections: true } },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return projects.map((project) => ({
    ...project,
    coverImage: project.coverImage
      ? { ...project.coverImage, publicUrl: getMediaPublicUrl(project.coverImage.objectKey) }
      : null,
  }));
}

export async function getProjectById(id: string) {
  if (!isUuid(id)) return null;
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true, slug: true, type: true, status: true, coverImageId: true,
      sortOrder: true, publishedAt: true,
      translations: {
        select: {
          locale: true, title: true, subtitle: true, excerpt: true,
          seoTitle: true, seoDescription: true,
        },
      },
      sections: {
        select: {
          id: true, variant: true, sortOrder: true, isActive: true, updatedAt: true,
          translations: {
            where: { locale: { in: ['ru', 'en'] } },
            select: { locale: true, title: true, subtitle: true },
          },
          _count: { select: { media: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });
  if (!project) return null;
  const ru = project.translations.find((item) => item.locale === 'ru');
  const en = project.translations.find((item) => item.locale === 'en');
  const empty = { title: '', subtitle: null, excerpt: null, seoTitle: null, seoDescription: null };
  const defaultValues: ProjectFormValues = {
    slug: project.slug,
    type: project.type,
    status: project.status,
    coverImageId: project.coverImageId,
    sortOrder: project.sortOrder,
    publishedAt: project.publishedAt,
    translations: {
      ru: ru ? { title: ru.title, subtitle: ru.subtitle, excerpt: ru.excerpt, seoTitle: ru.seoTitle, seoDescription: ru.seoDescription } : { ...empty },
      en: en ? { title: en.title, subtitle: en.subtitle, excerpt: en.excerpt, seoTitle: en.seoTitle, seoDescription: en.seoDescription } : { ...empty },
    },
  };
  return { id: project.id, defaultValues, sections: project.sections };
}

export async function getProjectMediaOptions() {
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
