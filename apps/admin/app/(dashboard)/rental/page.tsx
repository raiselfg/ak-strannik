import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { FerrisWheel, PackageOpen, Shirt } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../../_components/page-header';

export const metadata: Metadata = { title: 'Аренда' };

const sections = [
  {
    href: '/rental/attraction',
    title: 'Аттракционы',
    description: 'Аттракционы, доступные для аренды.',
    icon: FerrisWheel,
  },
  {
    href: '/rental/mascot-costume',
    title: 'Ростовые костюмы',
    description: 'Каталог ростовых костюмов.',
    icon: Shirt,
  },
  {
    href: '/rental/requisite',
    title: 'Реквизит',
    description: 'Реквизит, доступный для аренды.',
    icon: PackageOpen,
  },
] as const;

export default function RentalPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Выберите категорию каталога аренды."
        title="Аренда"
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
    </div>
  );
}
