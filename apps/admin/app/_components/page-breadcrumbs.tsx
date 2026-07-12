import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function PageBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            aria-label="Главная"
            className="transition-colors hover:text-foreground"
            href="/"
          >
            <Home className="size-4" />
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex items-center gap-1.5" key={item.label}>
            <ChevronRight className="size-3.5" />
            {item.href ? (
              <Link
                className="transition-colors hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
