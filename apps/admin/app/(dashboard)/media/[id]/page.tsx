import type { Metadata } from 'next';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { CopyUrlButton } from '../../../../features/media/copy-url-button';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteMediaAssetAction } from '../../../../features/media/actions';
import {
  formatFileSize,
  formatImageDimensions,
} from '../../../../features/media/format';
import { MediaAssetMetadataForm } from '../../../../features/media/media-metadata-form';
import { MediaPreview } from '../../../../features/media/media-preview';
import { getMediaAssetById } from '../../../../features/media/queries';

export const metadata: Metadata = { title: 'Редактирование медиафайла' };

export default async function MediaAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await getMediaAssetById(id);
  if (!asset) notFound();
  const alt =
    asset.translations.find((item) => item.locale === 'ru')?.alt ??
    asset.translations.find((item) => item.locale === 'en')?.alt ??
    asset.originalName;
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Медиатека', href: '/media' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          title="Редактирование медиафайла"
          description="Технические сведения и локализованные метаданные изображения."
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <div className="space-y-6">
          <MediaPreview
            url={asset.publicUrl}
            alt={alt}
            className="aspect-video rounded-xl border"
          />
          <Card>
            <CardHeader>
              <CardTitle>Метаданные</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaAssetMetadataForm
                id={asset.id}
                defaultValues={asset.defaultValues}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Технические данные</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                <Info label="Оригинальное имя" value={asset.originalName} />
                <Info label="MIME-тип" value={asset.mimeType} />
                <Info label="Размер" value={formatFileSize(asset.size)} />
                <Info
                  label="Разрешение"
                  value={formatImageDimensions(asset.width, asset.height)}
                />
                <Info
                  label="SHA-256"
                  value={
                    asset.checksumSha256 ?? 'Не рассчитан для legacy-файла'
                  }
                />
                <Info label="Object key" value={asset.objectKey} />
                <Info
                  label="Создан"
                  value={new Intl.DateTimeFormat('ru-RU', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(asset.createdAt)}
                />
                <Info
                  label="Обновлён"
                  value={new Intl.DateTimeFormat('ru-RU', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(asset.updatedAt)}
                />
                <Info label="Публичный URL" value={asset.publicUrl} />
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <CopyUrlButton url={asset.publicUrl} />
                <Button asChild variant="outline">
                  <Link href="/media">Назад</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Использование файла</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {asset.usage.length
                  ? asset.usage.join(', ')
                  : 'Файл пока нигде не используется.'}
              </p>
              <DeleteDialog
                args={[asset.id]}
                deleteAction={deleteMediaAssetAction}
                description="Файл будет удалён из хранилища и медиатеки. Это действие нельзя отменить."
                disabledReason={
                  asset.usage.length
                    ? `Нельзя удалить файл, пока он используется: ${asset.usage.join(', ')}.`
                    : undefined
                }
                redirectTo="/media"
                title="Удалить медиафайл?"
                triggerLabel="Удалить медиафайл"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b pb-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-all">{value}</dd>
    </div>
  );
}
