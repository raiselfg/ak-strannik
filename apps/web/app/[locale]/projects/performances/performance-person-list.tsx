import type { PublicPerformancePerson } from '@/features/performances/queries';

export function PerformancePersonList({
  persons,
  title,
}: {
  persons: PublicPerformancePerson[];
  title: string;
}) {
  if (persons.length === 0) return null;

  return (
    <section className="mt-7 border-t border-border/35 pt-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {persons.map((person) => (
          <li
            key={person.id}
            className="before:text-gold rounded-3xl border border-border/35 bg-background/25 px-4 py-3 text-muted-foreground before:mr-2 before:content-['✦']"
          >
            {person.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
