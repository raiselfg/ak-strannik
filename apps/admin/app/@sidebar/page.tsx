import Link from "next/link";
import { adminEntityGroups } from "../_config/admin-entities";

export default function SidebarSlot() {
  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col overflow-y-auto border-r border-foreground/10 bg-foreground/[0.03] px-4 py-6">
      <div className="mb-6">
        <p className="text-sm text-foreground/60">Akademiya stranstviy</p>
        <h1 className="text-xl font-semibold">Admin</h1>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col gap-5">
        <Link
          href="/"
          className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground/10"
        >
          Dashboard
        </Link>

        {adminEntityGroups.map((group) => (
          <section className="grid gap-1" key={group.label}>
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-foreground/45">
              {group.label}
            </h2>
            {group.entities.map((entity) => (
              <Link
                className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-foreground/10"
                href={`/entities/${entity.slug}`}
                key={entity.slug}
              >
                {entity.label}
              </Link>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}
