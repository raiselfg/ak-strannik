import type { getProjects } from './queries';

export type ProjectsResult = Awaited<ReturnType<typeof getProjects>>;
