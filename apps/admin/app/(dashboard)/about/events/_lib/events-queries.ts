import { Prisma, prisma } from '@ak-strannik/database';

type EventsListItem = Prisma.EventsContentGetPayload<{
  select: { id: true; year: true; _count: { select: { events: true } } };
}>;

type EventsContentForEdit = Prisma.EventsContentGetPayload<{
  include: {
    events: {
      include: { translations: true };
      orderBy: { position: 'asc' };
    };
  };
}>;

export async function getEventsContents(): Promise<EventsListItem[]> {
  return prisma.eventsContent.findMany({
    select: {
      id: true,
      year: true,
      _count: { select: { events: true } },
    },
    orderBy: [{ year: 'desc' }, { id: 'asc' }],
  });
}

export async function getEventsContent(
  id: string
): Promise<EventsContentForEdit | null> {
  return prisma.eventsContent.findUnique({
    where: { id },
    include: {
      events: {
        include: { translations: true },
        orderBy: { position: 'asc' },
      },
    },
  });
}
