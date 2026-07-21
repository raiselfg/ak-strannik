# Admin Application Instructions

These instructions apply to all files inside `apps/admin`.

## Working mode

Before changing code:

1. Read this file completely.
2. Read the task-specific prompt and implement only the requested phase.
3. Inspect existing project conventions before creating files.
4. Inspect relevant exports from workspace packages.
5. Do not guess import paths, exported names, helper signatures, or component APIs.
6. Do not implement entities or features outside the current phase.
7. Preserve existing authentication, layout, styling, and repository conventions.

When a task requests an audit or investigation only, do not modify files.

---

## Project stack

The admin application uses:

- Next.js 16;
- App Router;
- React Server Components;
- Server Actions;
- React Hook Form;
- Zod;
- `@hookform/resolvers`;
- Prisma from the shared database package;
- Better Auth;
- shadcn/ui from a shared Turborepo package;
- S3-compatible MinIO storage.

All protected dashboard routes must be placed under:

```text
apps/admin/app/(dashboard)
```
