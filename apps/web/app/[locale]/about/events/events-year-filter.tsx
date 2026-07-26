import { Link } from '@/i18n/navigation';

export function EventsYearFilter({
  years,
  activeYear,
  label,
  allYearsLabel,
}: {
  years: string[];
  activeYear?: string;
  label: string;
  allYearsLabel: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        <li>
          <YearFilterLink href="/about/events" active={!activeYear}>
            {allYearsLabel}
          </YearFilterLink>
        </li>
        {years.map((year) => (
          <li key={year}>
            <YearFilterLink
              href={{
                pathname: '/about/events',
                query: { year },
              }}
              active={year === activeYear}
            >
              {year}
            </YearFilterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function YearFilterLink({
  href,
  active,
  children,
}: {
  href: Parameters<typeof Link>[0]['href'];
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'border-gold/45 bg-gold/15 text-gold inline-flex min-h-11 items-center rounded-full border px-5 py-2 text-sm font-semibold shadow-lg shadow-background/20'
          : 'hover:border-gold/45 hover:bg-gold/10 hover:text-gold inline-flex min-h-11 items-center rounded-full border border-border/50 bg-background/30 px-5 py-2 text-sm font-medium text-muted-foreground transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none'
      }
    >
      {children}
    </Link>
  );
}
