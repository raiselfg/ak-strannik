import { prisma } from '@ak-strannik/database';
import type { ProjectSectionFormValues } from './schema';

export async function getProjectByIdForSection(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
}

export async function getNextProjectSectionSortOrder(projectId: string) {
  const result = await prisma.projectSection.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });
  return result._max.sortOrder === null ? 0 : result._max.sortOrder + 1;
}

export async function getProjectSectionById(
  projectId: string,
  sectionId: string
) {
  const section = await prisma.projectSection.findFirst({
    where: { id: sectionId, projectId },
    select: {
      id: true,
      projectId: true,
      variant: true,
      videoProvider: true,
      videoUrl: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: {
          locale: true,
          title: true,
          subtitle: true,
          body: true,
          author: true,
        },
      },
      media: {
        select: { mediaId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  if (!section) return null;
  const ru = section.translations.find((item) => item.locale === 'ru');
  const en = section.translations.find((item) => item.locale === 'en');
  const empty = { title: null, subtitle: null, body: null, author: null };
  const defaultValues: ProjectSectionFormValues = {
    variant: section.variant,
    videoProvider: section.videoProvider,
    videoUrl: section.videoUrl,
    sortOrder: section.sortOrder,
    isActive: section.isActive,
    translations: {
      ru: ru
        ? {
            title: ru.title,
            subtitle: ru.subtitle,
            body: ru.body,
            author: ru.author,
          }
        : { ...empty },
      en: en
        ? {
            title: en.title,
            subtitle: en.subtitle,
            body: en.body,
            author: en.author,
          }
        : { ...empty },
    },
    media: section.media.map((item, index) => ({
      mediaId: item.mediaId,
      sortOrder: index,
    })),
  };
  return { id: section.id, projectId: section.projectId, defaultValues };
}
