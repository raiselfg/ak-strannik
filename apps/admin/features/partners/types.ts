import type { getPartners } from './queries';

export type PartnersResult = Awaited<ReturnType<typeof getPartners>>;
