import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { PartnerForm } from '../../../../features/partners/partner-form';
import { getPartnerMediaOptions } from '../../../../features/partners/queries';

export const metadata: Metadata = { title: 'Новый партнёр' };

export default async function NewPartnerPage() {
  const mediaOptions = await getPartnerMediaOptions();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[
          { label: 'Партнёры', href: '/partners' },
          { label: 'Новый партнёр' },
        ]} />
        <PageHeader
          description="Добавьте информацию, логотип и переводы нового партнёра."
          title="Новый партнёр"
        />
      </div>
      <PartnerForm mediaOptions={mediaOptions} mode="create" />
    </div>
  );
}
