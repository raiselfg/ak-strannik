import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent, CardFooter } from '@ak-strannik/ui/components/card';
import Link from 'next/link';
import type { getMediaAssets } from './queries';
import { CopyUrlButton } from './copy-url-button';
import { formatFileSize, formatImageDimensions } from './format';
import { MediaPreview } from './media-preview';
import { DeleteMediaAssetDialog } from './delete-media-asset-dialog';

type Asset = Awaited<ReturnType<typeof getMediaAssets>>[number];

export function MediaAssetGrid({ assets }: { assets: Asset[] }) {
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => {
    const translation = asset.translations.find((item) => item.locale === 'ru') ?? asset.translations.find((item) => item.locale === 'en');
    return <Card key={asset.id}>
      <MediaPreview url={asset.publicUrl} alt={translation?.alt || asset.originalName} className="aspect-video border-b" />
      <CardContent className="space-y-2"><div className="flex items-start justify-between gap-2"><p className="min-w-0 truncate font-medium" title={asset.originalName}>{asset.originalName}</p>{asset.usage.length ? <Badge variant="secondary">Используется</Badge> : null}</div><dl className="grid grid-cols-2 gap-1 text-xs text-muted-foreground"><dt>Тип</dt><dd className="text-right">{asset.mimeType}</dd><dt>Размер</dt><dd className="text-right">{formatFileSize(asset.size)}</dd><dt>Разрешение</dt><dd className="text-right">{formatImageDimensions(asset.width, asset.height)}</dd><dt>Загружен</dt><dd className="text-right">{new Intl.DateTimeFormat('ru-RU').format(asset.createdAt)}</dd></dl></CardContent>
      <CardFooter className="flex flex-wrap gap-2"><Button asChild size="sm"><Link href={`/media/${asset.id}`}>Редактировать</Link></Button><CopyUrlButton url={asset.publicUrl} size="sm" /><DeleteMediaAssetDialog id={asset.id} usage={asset.usage} /></CardFooter>
    </Card>;
  })}</div>;
}
