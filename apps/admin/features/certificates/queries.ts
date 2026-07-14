import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { CertificateFormValues } from './schema';

export async function getCertificates() {
  const certificates = await prisma.certificate.findMany({
    select: {
      id: true,
      imageId: true,
      image: { select: { originalName: true, objectKey: true } },
      year: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        select: { locale: true, title: true, issuer: true },
        where: { locale: { in: ['ru', 'en'] } },
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }, { createdAt: 'desc' }],
  });

  return certificates.map((certificate) => ({
    ...certificate,
    image: certificate.image
      ? {
          ...certificate.image,
          publicUrl: getMediaPublicUrl(certificate.image.objectKey),
        }
      : null,
  }));
}

export async function getCertificateById(id: string) {
  if (!isUuid(id)) return null;
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    select: {
      id: true,
      imageId: true,
      year: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: { locale: true, title: true, issuer: true, description: true },
      },
    },
  });

  if (!certificate) return null;
  const ru = certificate.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = certificate.translations.find(
    (translation) => translation.locale === 'en'
  );
  const defaultValues: CertificateFormValues = {
    imageId: certificate.imageId,
    year: certificate.year,
    sortOrder: certificate.sortOrder,
    isActive: certificate.isActive,
    translations: {
      ru: {
        title: ru?.title ?? '',
        issuer: ru?.issuer ?? null,
        description: ru?.description ?? null,
      },
      en: {
        title: en?.title ?? null,
        issuer: en?.issuer ?? null,
        description: en?.description ?? null,
      },
    },
  };

  return { id: certificate.id, defaultValues };
}
