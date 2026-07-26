import type { PublicPryalochkaActor } from '@/features/pryalochka-of-time/queries';

export function PryalochkaActorList({
  actors,
  title,
}: {
  actors: PublicPryalochkaActor[];
  title: string;
}) {
  if (actors.length === 0) return null;

  return (
    <section>
      <h2 className="content-page__title">{title}</h2>
      <ol className="mt-8 grid gap-px overflow-hidden rounded-[2.5rem] border border-border/45 bg-border/45 md:grid-cols-2">
        {actors.map((actor) => (
          <li key={actor.id} className="bg-card p-7 sm:p-9">
            <h3 className="mt-5 text-2xl font-semibold">{actor.name}</h3>
            <p className="mt-4 leading-8 whitespace-pre-line text-muted-foreground">
              {actor.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
