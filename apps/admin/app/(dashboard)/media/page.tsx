import { Images } from 'lucide-react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { getMediaAssets } from '../../../features/media/queries';
import { MediaAssetGrid } from '../../../features/media/media-asset-grid';
import { MediaUploadDialog } from '../../../features/media/media-upload-dialog';

export const metadata: Metadata = { title: 'Медиатека' };

function MediaPageFallback() {
  return <div className="h-48 animate-pulse rounded-xl border bg-card" />;
}

async function MediaPageContent() {
  await connection();
  const assets = await getMediaAssets();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[{ label: 'Медиатека' }]} />
        <PageHeader
          title="Медиатека"
          description="Единое хранилище изображений сайта и их локализованных метаданных."
          action={<MediaUploadDialog />}
        />
      </div>
      {assets.length > 0 ? (
        <MediaAssetGrid assets={assets} />
      ) : (
        <div className="space-y-4">
          <EmptyState
            icon={Images}
            title="Медиафайлы пока не загружены"
            description="Загрузите первое изображение или другой поддерживаемый файл."
          />
          <div className="flex justify-center">
            <MediaUploadDialog />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={<MediaPageFallback />}>
      <MediaPageContent />
    </Suspense>
  );
}
