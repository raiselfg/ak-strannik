import type { getCertificates } from './queries';

export type CertificatesResult = Awaited<ReturnType<typeof getCertificates>>;
