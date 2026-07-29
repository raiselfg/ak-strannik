import type { CreateTeamMemberDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../_components/page-header';
import { TeamForm } from '../../_components/team-form';
import { getTeamMember } from '../../_lib/team-queries';
export const metadata: Metadata = { title: 'Редактирование участника команды' };
export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) notFound();
  const ru = member.translations.find((item) => item.locale === 'ru');
  const en = member.translations.find((item) => item.locale === 'en');
  const initialValues: CreateTeamMemberDto = {
    image: member.image,
    links: member.links.map((link) => ({
      href: link.href,
      translations: [
        {
          locale: 'ru',
          label:
            link.translations.find((item) => item.locale === 'ru')?.label ?? '',
        },
        {
          locale: 'en',
          label:
            link.translations.find((item) => item.locale === 'en')?.label ?? '',
        },
      ],
    })),
    achievements: member.achievements,
    translations: [
      {
        locale: 'ru',
        name: ru?.name ?? '',
        role: ru?.role ?? '',
        bio: ru?.bio ?? '',
      },
      {
        locale: 'en',
        name: en?.name ?? '',
        role: en?.role ?? '',
        bio: en?.bio ?? '',
      },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените данные и переводы участника."
        title={ru?.name || 'Редактирование участника'}
      />
      <TeamForm initialValues={initialValues} memberId={member.id} />
    </div>
  );
}
