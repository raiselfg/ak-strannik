'use client';

import { Button } from '@ak-strannik/ui/components/button';

export function ContentPageError({
  title,
  description,
  retry,
  reset,
}: {
  title: string;
  description: string;
  retry: string;
  reset: () => void;
}) {
  return (
    <section className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl rounded-4xl border border-border/45 bg-card/45 p-8 text-center shadow-xl shadow-background/25 backdrop-blur-sm">
          <h1 className="font-hand text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-muted-foreground">{description}</p>
          <Button className="mt-7" onClick={reset}>
            {retry}
          </Button>
        </div>
      </div>
    </section>
  );
}
