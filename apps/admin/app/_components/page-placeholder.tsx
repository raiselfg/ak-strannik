import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageBreadcrumbs, type BreadcrumbItem } from './page-breadcrumbs';
import { PageHeader } from './page-header';

export function PagePlaceholder({
  title,
  description,
  placeholder,
  backHref,
  breadcrumbs,
  children,
}: {
  title: string;
  description: string;
  placeholder: string;
  backHref: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
}) {
  return (
    <div className="space-y-7">
      <div>
        <PageBreadcrumbs items={breadcrumbs} />
        <PageHeader description={description} title={title} />
      </div>

      <Card>
        <CardHeader>
          <span className="mb-3 grid size-10 place-items-center rounded-xl bg-muted">
            <Construction className="size-5 text-muted-foreground" />
          </span>
          <CardTitle>Раздел готовится</CardTitle>
          <CardDescription>{placeholder}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href={backHref}>
              <ArrowLeft />
              Назад
            </Link>
          </Button>
        </CardContent>
      </Card>

      {children}
    </div>
  );
}
