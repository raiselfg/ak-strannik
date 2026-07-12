import type { getTeamMembers } from './queries';

export type AwaitedReturn = Awaited<ReturnType<typeof getTeamMembers>>;
