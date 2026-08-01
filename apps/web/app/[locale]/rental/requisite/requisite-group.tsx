import type { PublicRequisiteGroup } from '@/features/requisite/queries';
import { RentalMasonry } from '../_components/rental-masonry';

export function RequisiteGroup({
  group,
  groupTitle,
  itemTitle,
  emptyMessage,
  imageAlt,
  imageUnavailable,
}: {
  group: PublicRequisiteGroup;
  groupTitle: string;
  itemTitle: (index: number) => string;
  emptyMessage: string;
  imageAlt: (title: string, index: number) => string;
  imageUnavailable: string;
}) {
  return (
    <section className="rounded-4xl border border-border/45 bg-card/45 p-5 shadow-xl shadow-background/25 sm:p-7">
      <h2 className="text-2xl font-semibold sm:text-3xl">{groupTitle}</h2>
      {group.requisites.length === 0 ? (
        <p className="mt-5 rounded-3xl border border-border/35 bg-background/25 px-5 py-4 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <RentalMasonry
          className="mt-6"
          items={group.requisites.map((item, index) => {
            const title = item.title?.trim() || itemTitle(index);
            return {
              id: item.id,
              image: item.image,
              imageAlt: imageAlt(title, index),
              imageUnavailable,
              caption: item.title?.trim() || null,
              captionKind: 'heading' as const,
            };
          })}
        />
      )}
    </section>
  );
}
