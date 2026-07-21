import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Pencil, Plus, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../_components/delete-dialog';
import { EmptyState } from '../../_components/empty-state';
import { MediaImage } from '../../_components/media-image';
import { PageHeader } from '../../_components/page-header';
import { deleteTeamMember } from './_actions/team.actions';
import { getTeamMembers } from './_lib/team-queries';
export const metadata: Metadata = { title: 'Команда' };
const nameFallback = 'Участник без русского имени';
function bioPreview(value: string | null | undefined) {
  if (!value) return null;
  return value.length > 140 ? `${value.slice(0, 137)}…` : value;
}
export default async function TeamPage() {
  const members = await getTeamMembers();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/team/new">
              <Plus />
              Новый участник
            </Link>
          </Button>
        }
        description="Управление участниками команды и переводами."
        title="Команда"
      />
      {members.length === 0 ? (
        <EmptyState
          actionHref="/team/new"
          actionLabel="Добавить участника"
          description="Создайте первую карточку участника команды."
          icon={Users}
          title="Команда пока пуста"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const translation = member.translations.find(
              (item) => item.locale === 'ru'
            );
            const name = translation?.name || nameFallback;
            const bio = bioPreview(translation?.bio);
            return (
              <Card key={member.id}>
                <MediaImage
                  alt={`Фотография «${name}»`}
                  className="aspect-square w-full"
                  fit="cover"
                  src={member.image}
                />
                <CardHeader>
                  <CardTitle>{name}</CardTitle>
                  {translation?.role ? (
                    <p className="text-sm text-muted-foreground">
                      {translation.role}
                    </p>
                  ) : null}
                </CardHeader>
                {bio ? (
                  <CardContent>
                    <p className="line-clamp-4 leading-6 text-muted-foreground">
                      {bio}
                    </p>
                  </CardContent>
                ) : null}
                <CardFooter className="gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/team/${member.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[member.id]}
                    deleteAction={deleteTeamMember}
                    description={
                      <span>
                        Участник «{name}» будет удалён вместе с переводами. Это
                        действие необратимо.
                      </span>
                    }
                    title="Удалить участника команды?"
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
