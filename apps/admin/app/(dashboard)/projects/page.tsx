import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import {
  Drama,
  GalleryVerticalEnd,
  GraduationCap,
  Music,
  Palette,
  PartyPopper,
  Sparkles,
  Theater,
  UsersRound,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../../_components/page-header';

export const metadata: Metadata = { title: 'Проекты' };

const sections = [
  { href: '/projects/artists', title: 'Артисты', icon: UsersRound },
  { href: '/projects/concerts', title: 'Концерты', icon: Music },
  { href: '/projects/exhibitions', title: 'Выставки', icon: Palette },
  { href: '/projects/festival', title: 'Фестивали', icon: PartyPopper },
  {
    href: '/projects/holiday-shows',
    title: 'Праздничные представления',
    icon: Sparkles,
  },
  {
    href: '/projects/masterclasses',
    title: 'Мастер-классы',
    icon: GraduationCap,
  },
  { href: '/projects/performances', title: 'Спектакли', icon: Theater },
  {
    href: '/projects/pryalochka-of-time',
    title: 'Прялочка времени',
    icon: GalleryVerticalEnd,
  },
  { href: '/projects/usta', title: 'Уста', icon: Drama },
] as const;

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Выберите проект для управления его содержимым."
        title="Проекты"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, icon: Icon }) => (
          <Link className="group" href={href} key={href}>
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
              <CardHeader>
                <span className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                  Управление содержимым раздела.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
