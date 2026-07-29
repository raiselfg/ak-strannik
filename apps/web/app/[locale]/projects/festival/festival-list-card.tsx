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
    <li className="h-full">
      <Link
        href={`/projects/festival/${festival.slug}`}
        className="group hover:border-gold/40 flex h-full flex-col rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        aria-label={`${festival.title} — ${readMore}`}
      >
        <ContentImage
          src={festival.cover}
          alt={imageAlt}
          emptyLabel={imageUnavailable}
          contain
        />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h2 className="line-clamp-2 min-h-14 text-2xl leading-7 font-semibold">
            {festival.title}
          </h2>
          <p className="text-gold mt-auto pt-4 text-sm font-medium">
            {readMore}
          </p>
        </div>
      </Link>
    </li>
  );
}
