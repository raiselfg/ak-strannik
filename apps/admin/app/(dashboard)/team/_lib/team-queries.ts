import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.TeamMemberGetPayload<{
  include: { translations: true };
}>;
export async function getTeamMembers(): Promise<RecordWithTranslations[]> {
  return prisma.teamMember.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getTeamMember(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.teamMember.findUnique({
    where: { id },
    include: { translations: true },
  });
}
