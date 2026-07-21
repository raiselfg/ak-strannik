import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { FolderKanban, Handshake, PackageOpen, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../_components/page-header';

export const metadata: Metadata = { title: 'Панель управления' };

const sections = [
  {
    href: '/about',
    title: 'О нас',
    description: '',
    icon: Handshake,
  },
  {
    href: '/projects',
    title: 'Проекты',
    description: 'Публикации, страницы проектов и их секции.',
    icon: FolderKanban,
  },
  {
    href: '/rentals',
    title: 'Аренда',
    description: 'Каталог костюмов, аттракционов и реквизита.',
    icon: PackageOpen,
  },
  {
    href: '/team',
    title: 'Команда',
    description: 'Участники команды и информация о них.',
    icon: Users,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Выберите раздел для управления содержимым сайта AK Strannik."
        title="Панель управления"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link className="group" href={href} key={href}>
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
              <CardHeader>
                <span className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-6">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние изменения</CardTitle>
          <CardDescription>
            Здесь появится история изменений после подключения данных.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            Изменений пока нет
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
