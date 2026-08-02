import type { UpdateFestivalContentDto } from '@ak-strannik/types/festival';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { FestivalContentForm } from '../../_components/festival-content-form';
import { getFestivalContent } from '../../_lib/festival-queries';

export const metadata: Metadata = { title: 'Редактирование фестиваля' };

export default async function EditFestivalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getFestivalContent(id);
  if (!record) notFound();
  const rootTranslation = (locale: 'ru' | 'en') =>
    record.translations.find((item) => item.locale === locale);
  const ru = rootTranslation('ru');
  const initialValues: UpdateFestivalContentDto = {
    logo: record.logo,
    slug: record.slug,
    images: record.images,
    videos: record.videos,
    achievements: record.achievements,
    socials: record.socials,
    translations: (['ru', 'en'] as const).map((locale) => {
      const item = rootTranslation(locale);
      return { id: item?.id, locale, title: item?.title ?? '' };
    }),
    events: record.events.map((event) => ({
      id: event.id,
      position: event.position,
      translations: (['ru', 'en'] as const).map((locale) => {
        const item = event.translations.find(
          (translation) => translation.locale === locale
        );
        return {
          id: item?.id,
          locale,
          title: item?.title ?? '',
          text: item?.text ?? '',
        };
      }),
    })),
    nominations: record.nominations
      ? {
          id: record.nominations.id,
          translations: (['ru', 'en'] as const).map((locale) => {
            const item = record.nominations?.translations.find(
              (translation) => translation.locale === locale
            );
            return {
              id: item?.id,
              locale,
              title: item?.title ?? '',
              text: item?.text ?? '',
            };
          }),
        }
      : null,
    jury: record.jury
      ? {
          id: record.jury.id,
          translations: (['ru', 'en'] as const).map((locale) => {
            const item = record.jury?.translations.find(
              (translation) => translation.locale === locale
            );
            return { id: item?.id, locale, title: item?.title ?? '' };
          }),
          persons: record.jury.persons.map((person) => ({
            id: person.id,
            image: person.image,
            position: person.position,
            translations: (['ru', 'en'] as const).map((locale) => {
              const item = person.translations.find(
                (translation) => translation.locale === locale
              );
              return {
                id: item?.id,
                locale,
                name: item?.name ?? '',
                position: item?.position ?? '',
              };
            }),
          })),
        }
      : null,
    organizations: record.organizations
      ? {
          id: record.organizations.id,
          translations: (['ru', 'en'] as const).map((locale) => {
            const item = record.organizations?.translations.find(
              (translation) => translation.locale === locale
            );
            return { id: item?.id, locale, title: item?.title ?? '' };
          }),
          organizations: record.organizations.organizations.map(
            (organization) => ({
              id: organization.id,
              value: organization.value,
              position: organization.position,
              translations: (['ru', 'en'] as const).map((locale) => {
                const item = organization.translations.find(
                  (translation) => translation.locale === locale
                );
                return { id: item?.id, locale, name: item?.name ?? '' };
              }),
            })
          ),
        }
      : null,
  };
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        description="Измените агрегат и сохраните его одной кнопкой."
        title={ru?.title || record.slug}
      />
      <FestivalContentForm
        contentId={record.id}
        initialValues={initialValues}
      />
    </div>
  );
}
