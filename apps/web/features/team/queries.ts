import 'server-only';

import { prisma } from '@ak-strannik/database';
import type { Locale } from '@/i18n/routing';
import { mapTeamMember } from './mappers';
import type { PublicTeamMember } from './types';

export async function getActiveTeamMembers(
  locale: Locale
): Promise<PublicTeamMember[]> {
  const query = () =>
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        translations: {
          where: { locale: { in: locale === 'en' ? ['en', 'ru'] : ['ru'] } },
          select: { locale: true, name: true, role: true, description: true },
        },
        image: {
          select: {
            objectKey: true,
            width: true,
            height: true,
            translations: {
              where: {
                locale: { in: locale === 'en' ? ['en', 'ru'] : ['ru'] },
              },
              select: { locale: true, alt: true, title: true },
            },
          },
        },
      },
    });

  let members;
  try {
    members = await query();
  } catch (error) {
    if (!isClosedConnectionError(error)) throw error;
    members = await query();
  }

  return members.flatMap((member) => {
    const mapped = mapTeamMember(member, locale);
    return mapped ? [mapped] : [];
  });
}

function isClosedConnectionError(error: unknown): error is { code: 'P1017' } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P1017'
  );
}
