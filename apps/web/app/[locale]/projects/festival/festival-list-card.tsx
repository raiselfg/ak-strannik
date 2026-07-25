import { ContentImage } from '@/app/_components/content/content-image-gallery';
import type { PublicFestivalCard } from '@/features/festival/queries';
import { Link } from '@/i18n/navigation';

export function FestivalListCard({
  festival,
  imageAlt,
  imageUnavailable,
  readMore,
}: {
  festival: PublicFestivalCard;
  imageAlt: string;
  imageUnavailable: string;
  readMore: string;
}) {
  return (
    <li>
      <Link
        href={`/projects/festival/${festival.slug}`}
        className="group hover:border-gold/40 block rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        aria-label={`${festival.title} — ${readMore}`}
      >
        <ContentImage
          src={festival.cover}
          alt={imageAlt}
          emptyLabel={imageUnavailable}
          contain
        />
        <div className="p-4 sm:p-5">
          <h2 className="text-2xl font-semibold">{festival.title}</h2>
          <p className="text-gold mt-3 text-sm font-medium">{readMore}</p>
        </div>
      </Link>
    </li>
  );
}
