import type { getRentalItems } from './queries';

export type RentalItemsResult = Awaited<ReturnType<typeof getRentalItems>>;
