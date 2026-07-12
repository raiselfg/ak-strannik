import type { getEvents } from './queries';

export type EventsResult = Awaited<ReturnType<typeof getEvents>>;
