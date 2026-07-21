import { Prisma, prisma } from '@ak-strannik/database';

type ThankYouNoteRecord = Prisma.ThankYouNoteContentGetPayload<object>;

export async function getThankYouNoteContents(): Promise<ThankYouNoteRecord[]> {
  return prisma.thankYouNoteContent.findMany({
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}

export async function getThankYouNoteContent(
  id: string
): Promise<ThankYouNoteRecord | null> {
  return prisma.thankYouNoteContent.findUnique({ where: { id } });
}
