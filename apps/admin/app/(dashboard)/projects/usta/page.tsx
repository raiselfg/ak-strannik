import type { UpdateUstaContentDto } from '@ak-strannik/types/usta';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '../../../_components/page-header';
import { UstaContentForm } from './_components/usta-content-form';
import { getUstaSingletonRecords } from './_lib/usta-query';

export const metadata: Metadata = { title: 'Уста' };

export default async function UstaPage() {
  const records = await getUstaSingletonRecords();
  if (records.length > 1) {
    return (
      <div className="space-y-8">
        <PageHeader
          description="Управление единственной записью раздела."
          title="Уста"
        />
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TriangleAlert />
              Ошибка конфигурации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Обнаружено несколько записей UstaContent. Этот раздел настроен как
              singleton. Исправьте данные вручную в базе перед продолжением.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const record = records[0];
  const ru = record?.translations.find((item) => item.locale === 'ru');
  const en = record?.translations.find((item) => item.locale === 'en');
  const initialValues: UpdateUstaContentDto = {
    videos: record?.videos ?? [],
    images: record?.images ?? [],
    achievements: record?.achievements ?? [],
    translations: [
      { id: ru?.id, locale: 'ru', text: ru?.text ?? '' },
      { id: en?.id, locale: 'en', text: en?.text ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        description={
          record
            ? 'Редактирование единственной записи раздела.'
            : 'Создание единственной записи раздела.'
        }
        title="Уста"
      />
      <UstaContentForm contentId={record?.id} initialValues={initialValues} />
    </div>
  );
}
