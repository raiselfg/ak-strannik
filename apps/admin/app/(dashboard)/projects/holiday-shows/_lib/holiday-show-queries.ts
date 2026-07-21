import { Prisma, prisma } from '@ak-strannik/database';
type RecordWithTranslations = Prisma.HolidayShowContentGetPayload<{
  include: { translations: true };
}>;
export async function getHolidayShowContents(): Promise<
  RecordWithTranslations[]
> {
  return prisma.holidayShowContent.findMany({
    include: { translations: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
}
export async function getHolidayShowContent(
  id: string
): Promise<RecordWithTranslations | null> {
  return prisma.holidayShowContent.findUnique({
    where: { id },
    include: { translations: true },
  });
}
