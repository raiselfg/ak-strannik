import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.ConcertContentGetPayload<{
  include: { translations: true };
}>;
export async function getConcertContents(): Promise<RecordWithTranslations[]> {
  return prisma.concertContent.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getConcertContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.concertContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
