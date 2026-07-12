import { prisma } from '@ak-strannik/database';
import { isUuid } from '../../lib/is-uuid';
import { getMediaPublicUrl } from '../../lib/s3cloud';
import type { MediaAssetMetadataFormValues } from './schema';

const usageSelect = {
  teamMembers: { select: { id: true } }, eventCovers: { select: { id: true } }, eventImages: { select: { id: true } },
  rentalItems: { select: { id: true } }, projectCovers: { select: { id: true } }, projectSectionMedia: { select: { id: true } },
  partnerLogos: { select: { id: true } }, certificateImages: { select: { id: true } },
} as const;

export async function getMediaAssets() {
  const assets = await prisma.mediaAsset.findMany({
    select: { id: true, objectKey: true, originalName: true, mimeType: true, size: true, width: true, height: true, createdAt: true, translations: { select: { locale: true, alt: true } }, ...usageSelect },
    orderBy: { createdAt: 'desc' },
  });
  return assets.map((asset) => ({ ...asset, publicUrl: getMediaPublicUrl(asset.objectKey), usage: getUsageLabels(asset) }));
}

export async function getMediaAssetById(id: string) {
  if (!isUuid(id)) return null;
  const asset = await prisma.mediaAsset.findUnique({ where: { id }, select: { id: true, objectKey: true, originalName: true, mimeType: true, size: true, width: true, height: true, createdAt: true, updatedAt: true, translations: { select: { locale: true, alt: true, title: true, caption: true } }, ...usageSelect } });
  if (!asset) return null;
  const ru = asset.translations.find((item) => item.locale === 'ru');
  const en = asset.translations.find((item) => item.locale === 'en');
  const defaultValues: MediaAssetMetadataFormValues = { translations: {
    ru: { alt: ru?.alt ?? null, title: ru?.title ?? null, caption: ru?.caption ?? null },
    en: { alt: en?.alt ?? null, title: en?.title ?? null, caption: en?.caption ?? null },
  } };
  return { ...asset, publicUrl: getMediaPublicUrl(asset.objectKey), usage: getUsageLabels(asset), defaultValues };
}

export async function getMediaAssetUsage(id: string) {
  if (!isUuid(id)) return [];
  const asset = await prisma.mediaAsset.findUnique({ where: { id }, select: usageSelect });
  return asset ? getUsageLabels(asset) : [];
}

type Usage = { [K in keyof typeof usageSelect]: readonly { id: string }[] };
function getUsageLabels(usage: Usage) {
  const labels: string[] = [];
  if (usage.teamMembers.length) labels.push('Команда');
  if (usage.eventCovers.length || usage.eventImages.length) labels.push('Мероприятия');
  if (usage.rentalItems.length) labels.push('Аренда');
  if (usage.projectCovers.length || usage.projectSectionMedia.length) labels.push('Проекты');
  if (usage.partnerLogos.length) labels.push('Партнёры');
  if (usage.certificateImages.length) labels.push('Сертификаты');
  return labels;
}
