import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { CalendarDays, HandHeart, Handshake, MailCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../../_components/page-header';

export const metadata: Metadata = { title: 'О нас' };

const sections = [
  {
    href: '/about/charity',
    title: 'Благотворительность',
    description: 'Благотворительные проекты и инициативы.',
    icon: HandHeart,
  },
  {
    href: '/about/events',
    title: 'События',
    description: 'События и материалы по годам.',
    icon: CalendarDays,
  },
  {
    href: '/about/partners',
    title: 'Партнёры',
    description: 'Партнёры организации.',
    icon: Handshake,
  },
  {
    href: '/about/thank-you-notes',
    title: 'Благодарственные письма',
    description: 'Благодарности и памятные письма.',
    icon: MailCheck,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Выберите подраздел страницы «О нас»."
        title="О нас"
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
