import type { ReactNode } from 'react';

import { cn } from '@ak-strannik/ui/lib/utils';

export type ContentPageProps = {
  params: Promise<{ locale: string }>;
};

export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <article className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-20 lg:px-8 lg:pt-40 lg:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto min-w-0">{children}</div>
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
    <header className="mb-8 max-w-4xl sm:mb-12">
      <h1 className="font-hand text-3xl leading-tight font-bold tracking-wide text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <div className="mt-4 text-base leading-7 whitespace-pre-line text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
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
      className={cn(
        'grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function ContentImageCard({ children }: { children: ReactNode }) {
  return (
    <li className="overflow-hidden rounded-3xl border border-border/45 bg-card/55 shadow-xl shadow-background/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:rounded-[2rem]">
      {children}
    </li>
  );
}

export function ContentContactNotice({ children }: { children: ReactNode }) {
  return (
    <p className="border-gold/25 bg-gold/10 mx-auto mt-8 w-fit max-w-full rounded-3xl border px-4 py-3 text-center text-sm break-words text-foreground sm:mt-10 sm:rounded-full sm:px-5 sm:text-lg">
      {children}
    </p>
  );
}
