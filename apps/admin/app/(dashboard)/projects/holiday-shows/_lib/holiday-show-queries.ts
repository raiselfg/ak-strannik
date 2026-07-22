import { Prisma, prisma } from '@ak-strannik/database';
type HolidayShowListItem = Prisma.HolidayShowContentGetPayload<{
  select: {
    id: true;
    images: true;
    translations: { select: { locale: true; title: true } };
  };
}>;
type RecordWithTranslations = Prisma.HolidayShowContentGetPayload<{
  include: { translations: true };
}>;
export async function getHolidayShowContents(): Promise<HolidayShowListItem[]> {
  return prisma.holidayShowContent.findMany({
    select: {
      id: true,
      images: true,
      translations: {
        where: { locale: 'ru' },
        select: { locale: true, title: true },
      },
    },
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
