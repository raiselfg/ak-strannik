import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import type { TeamMemberFormValues } from './schema';

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    select: {
      id: true,
      imageId: true,
      image: { select: { originalName: true, objectKey: true } },
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        select: { locale: true, name: true, role: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getTeamMemberById(id: string) {
  if (!isUuid(id)) return null;
  const member = await prisma.teamMember.findUnique({
    where: { id },
    select: {
      id: true,
      imageId: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: { locale: true, name: true, role: true, description: true },
      },
    },
  });

  if (!member) return null;
  const ru = member.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = member.translations.find(
    (translation) => translation.locale === 'en'
  );
  const defaultValues: TeamMemberFormValues = {
    imageId: member.imageId,
    sortOrder: member.sortOrder,
    isActive: member.isActive,
    translations: {
      ru: {
        name: ru?.name ?? '',
        role: ru?.role ?? null,
        description: ru?.description ?? null,
      },
      en: {
        name: en?.name ?? '',
        role: en?.role ?? null,
        description: en?.description ?? null,
      },
    },
  };

  return { id: member.id, defaultValues };
}
