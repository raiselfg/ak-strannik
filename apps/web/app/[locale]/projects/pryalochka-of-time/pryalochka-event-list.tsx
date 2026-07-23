import { ContentImage } from '@/app/_components/content/content-image-gallery';
import type { PublicPryalochkaEvent } from '@/features/pryalochka-of-time/queries';
import { Link } from '@/i18n/navigation';

type SafeLink =
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string };

export function PryalochkaEventList({
  events,
  title,
  eventLabel,
  imageAlt,
  linkLabel,
  imageUnavailable,
}: {
  events: PublicPryalochkaEvent[];
  title: string;
  eventLabel: (index: number) => string;
  imageAlt: (index: number) => string;
  linkLabel: string;
  imageUnavailable: string;
}) {
  if (events.length === 0) return null;

  return (
    <section>
      <h2 className="font-hand text-4xl font-bold sm:text-5xl">{title}</h2>
      <ol className="mt-7 space-y-6">
        {events.map((event, index) => {
          const link = getSafeLink(event.link);
          return (
            <li
              key={event.id}
              className="grid gap-6 rounded-4xl border border-border/45 bg-card/45 p-4 shadow-xl shadow-background/25 sm:p-6 lg:grid-cols-[minmax(16rem,0.8fr)_1.2fr] lg:items-center"
            >
              <ContentImage
                src={event.image}
                alt={imageAlt(index)}
                emptyLabel={imageUnavailable}
              />
              <div>
                <p className="text-gold mb-3 text-sm font-semibold tracking-[0.18em] uppercase">
                  {eventLabel(index)}
                </p>
                <p className="leading-8 whitespace-pre-line text-muted-foreground">
                  {event.text}
                </p>
                {link ? (
                  link.kind === 'internal' ? (
                    <Link
                      href={link.href}
                      className="text-gold border-gold/30 hover:bg-gold/10 mt-5 inline-flex min-h-11 items-center rounded-full border px-5 py-2 font-medium transition-colors"
                    >
                      {linkLabel}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold border-gold/30 hover:bg-gold/10 mt-5 inline-flex min-h-11 items-center rounded-full border px-5 py-2 font-medium transition-colors"
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
