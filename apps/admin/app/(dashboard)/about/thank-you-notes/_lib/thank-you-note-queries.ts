import { Prisma, prisma } from '@ak-strannik/database';

type ThankYouNoteRecord = Prisma.ThankYouNoteContentGetPayload<object>;
type ThankYouNoteListItem = Prisma.ThankYouNoteContentGetPayload<{
  select: { id: true; image: true };
}>;

export async function getThankYouNoteContents(): Promise<
  ThankYouNoteListItem[]
> {
  return prisma.thankYouNoteContent.findMany({
    select: { id: true, image: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}

export async function getThankYouNoteContent(
  id: string
): Promise<ThankYouNoteRecord | null> {
  return prisma.thankYouNoteContent.findUnique({ where: { id } });
}
