import { Prisma, prisma } from '@ak-strannik/database';
type TeamMemberListItem = Prisma.TeamMemberGetPayload<{
  select: {
    id: true;
    image: true;
    translations: {
      select: { locale: true; name: true; role: true; bio: true };
    };
  };
}>;
type RecordWithTranslations = Prisma.TeamMemberGetPayload<{
  include: {
    translations: true;
    links: { include: { translations: true } };
  };
}>;
export async function getTeamMembers(): Promise<TeamMemberListItem[]> {
  return prisma.teamMember.findMany({
    select: {
      id: true,
      image: true,
      translations: {
        where: { locale: 'ru' },
        select: { locale: true, name: true, role: true, bio: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getTeamMember(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.teamMember.findUnique({
    where: { id },
    include: {
      translations: true,
      links: {
        include: { translations: true },
        orderBy: { position: 'asc' },
      },
    },
  });
}
