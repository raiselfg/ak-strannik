import { ContentImage } from '@/app/_components/content/content-image-gallery';
import type { PublicRequisiteGroup } from '@/features/requisite/queries';

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
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {group.requisites.map((item, index) => {
            const title = item.title?.trim() || itemTitle(index);
            return (
              <li
                key={item.id}
                className="rounded-4xl border border-border/40 bg-background/25 p-3"
              >
                <ContentImage
                  src={item.image}
                  alt={imageAlt(title, index)}
                  emptyLabel={imageUnavailable}
                />
                {item.title?.trim() ? (
                  <h3 className="px-2 pt-4 pb-2 text-lg font-semibold">
                    {item.title}
                  </h3>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
