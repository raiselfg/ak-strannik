import Link from "next/link";
import { adminEntityGroups } from "./_config/admin-entities";

export default function Home() {
  return (
    <>
      <header className="mb-8 border-b border-foreground/10 pb-6">
        <p className="text-sm font-medium text-foreground/60">
          Prisma CRUD scaffold
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Admin dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/65">
          Basic list, create, read, edit and delete pages are available for the
          entities declared in packages/database/prisma/schema.prisma.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {adminEntityGroups.map((group) => (
          <section
            className="rounded-md border border-foreground/10 p-4"
            key={group.label}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {group.label}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.entities.map((entity) => (
                <Link
                  className="rounded-md border border-foreground/10 px-3 py-2 text-sm transition-colors hover:bg-foreground/10"
                  href={`/entities/${entity.slug}`}
                  key={entity.slug}
                >
                  <span className="block font-medium">{entity.label}</span>
                  <span className="mt-1 block font-mono text-xs text-foreground/50">
                    {entity.model}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
