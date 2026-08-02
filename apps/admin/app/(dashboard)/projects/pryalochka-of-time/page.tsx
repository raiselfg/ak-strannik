import type { UpdatePryalochkaOfTimeContentDto } from '@ak-strannik/types/pryalochka-of-time';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '../../../_components/page-header';
import { PryalochkaOfTimeForm } from './_components/pryalochka-of-time-form';
import { getPryalochkaOfTimeSingletonRecords } from './_lib/pryalochka-of-time-query';

export const metadata: Metadata = { title: 'Прялочка времени' };

export default async function PryalochkaOfTimePage() {
  const records = await getPryalochkaOfTimeSingletonRecords();

  if (records.length > 1) {
    return (
      <div className="space-y-8">
        <PageHeader
          description="Управление единственной записью раздела."
          title="Прялочка времени"
        />
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TriangleAlert /> Ошибка конфигурации
            </CardTitle>
          </CardHeader>
          <CardContent>
            Обнаружено несколько записей PryalochkaOfTimeContent. Этот раздел
            настроен как singleton. Исправьте данные вручную в базе перед
            продолжением.
          </CardContent>
        </Card>
      </div>
    );
  }

  const record = records[0];
  const initialValues: UpdatePryalochkaOfTimeContentDto = {
    images: record?.images ?? [],
    events:
      record?.events.map((event) => ({
        id: event.id,
        image: event.image,
        link: event.link ?? '',
        position: event.position,
        translations: ['ru', 'en'].map((locale) => {
          const translation = event.translations.find(
            (item) => item.locale === locale
          );
          return {
            id: translation?.id,
            locale: locale as 'ru' | 'en',
            text: translation?.text ?? '',
          };
        }),
      })) ?? [],
    actors:
      record?.actors.map((actor) => ({
        id: actor.id,
        position: actor.position,
        translations: ['ru', 'en'].map((locale) => {
          const translation = actor.translations.find(
            (item) => item.locale === locale
          );
          return {
            id: translation?.id,
            locale: locale as 'ru' | 'en',
            name: translation?.name ?? '',
            text: translation?.text ?? '',
          };
        }),
      })) ?? [],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        description={
          record
            ? 'Редактирование единственной записи раздела.'
            : 'Создание единственной записи раздела.'
        }
        title="Прялочка времени"
      />
      <PryalochkaOfTimeForm
        contentId={record?.id}
        initialValues={initialValues}
      />
    </div>
  );
}
