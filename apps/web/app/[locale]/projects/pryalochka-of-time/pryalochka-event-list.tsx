import { ContentImage } from '@/app/_components/content/content-image-gallery';
import type { PublicPryalochkaEvent } from '@/features/pryalochka-of-time/queries';
import { Link } from '@/i18n/navigation';

type SafeLink =
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string };

export function PryalochkaEventList({
  events,
  imageAlt,
  linkLabel,
  imageUnavailable,
}: {
  events: PublicPryalochkaEvent[];
  imageAlt: (index: number) => string;
  linkLabel: string;
  imageUnavailable: string;
}) {
  if (events.length === 0) return null;

  return (
    <section>
      <ol className="mt-8 space-y-8">
        {events.map((event, index) => {
          const link = getSafeLink(event.link);
          return (
            <li
              key={event.id}
              className="grid overflow-hidden rounded-[2.5rem] border border-border/45 bg-card/55 shadow-2xl shadow-background/25 lg:grid-cols-[minmax(18rem,0.85fr)_1.15fr] lg:items-stretch"
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
                <ContentImage
                  src={event.image}
                  alt={imageAlt(index)}
                  emptyLabel={imageUnavailable}
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <p className="text-lg leading-8 whitespace-pre-line text-muted-foreground">
                  {event.text}
                </p>
                {link ? (
                  link.kind === 'internal' ? (
                    <Link
                      href={link.href}
                      className="text-gold border-gold/30 hover:bg-gold/10 mt-7 inline-flex min-h-11 w-fit items-center rounded-full border px-5 py-2 font-medium transition-colors"
                    >
                      {linkLabel}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold border-gold/30 hover:bg-gold/10 mt-7 inline-flex min-h-11 w-fit items-center rounded-full border px-5 py-2 font-medium transition-colors"
                    >
                      {linkLabel}
                    </a>
                  )
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function getSafeLink(value: string | null): SafeLink | null {
  if (!value) return null;
  if (
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\')
  ) {
    return { kind: 'internal', href: value };
  }

  try {
    const url = new URL(value);
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return { kind: 'external', href: url.toString() };
  } catch {
    return null;
  }
}
