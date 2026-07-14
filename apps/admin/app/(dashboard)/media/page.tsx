import { Images } from 'lucide-react';
import type { Metadata } from 'next';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { getMediaAssets } from '../../../features/media/queries';
import { MediaAssetGrid } from '../../../features/media/media-asset-grid';
import { MediaUploadDialog } from '../../../features/media/media-upload-dialog';

export const metadata: Metadata = { title: 'Медиатека' };

export default async function MediaPage() {
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
      {assets.length ? (
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
