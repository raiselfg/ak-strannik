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
      <h2 className="font-hand text-4xl font-bold sm:text-5xl">{title}</h2>
      <ol className="mt-8 grid gap-px overflow-hidden rounded-[2.5rem] border border-border/45 bg-border/45 md:grid-cols-2">
        {actors.map((actor, index) => (
          <li
            key={actor.id}
            className="bg-card p-7 sm:p-9"
          >
            <p className="text-gold/60 font-hand text-4xl leading-none font-bold">
              {String(index + 1).padStart(2, '0')}
            </p>
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
