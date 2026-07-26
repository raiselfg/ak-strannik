import type { ReactNode } from 'react';

import { cn } from '@ak-strannik/ui/lib/utils';

export type ContentPageProps = {
  params: Promise<{ locale: string }>;
};

export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <article className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">{children}</div>
    </article>
  );
}

export function ContentPageHeader({
  title,
  description,
}: {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <header className="mb-10 max-w-4xl sm:mb-12">
      <h1 className="font-hand text-4xl font-bold tracking-wide sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <div className="mt-6 text-lg leading-8 whitespace-pre-line text-muted-foreground">
          {description}
        </div>
      ) : null}
    </header>
  );
}

export function ContentCardGrid({
  children,
  className,
  ordered = false,
}: {
  children: ReactNode;
  className?: string;
  ordered?: boolean;
}) {
  const Component = ordered ? 'ol' : 'ul';
  return (
    <Component
      className={cn('grid gap-6 sm:grid-cols-2 xl:grid-cols-3', className)}
    >
      {children}
    </Component>
  );
}

export function ContentImageCard({ children }: { children: ReactNode }) {
  return (
    <li className="overflow-hidden rounded-[2rem] border border-border/45 bg-card/55 shadow-xl shadow-background/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
      {children}
    </li>
  );
}

export function ContentContactNotice({ children }: { children: ReactNode }) {
  return (
    <p className="border-gold/25 bg-gold/10 mx-auto mt-10 w-fit rounded-full border px-5 py-3 text-center text-base text-foreground sm:text-lg">
      {children}
    </p>
  );
}
