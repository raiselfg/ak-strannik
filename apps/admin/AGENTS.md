Создай файл:

```text
apps/admin/AGENTS.md
```

И вставь в него следующее содержимое:

````md
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
````

---

## Existing project code

Before implementing CRUD, inspect:

```text
apps/admin/app/(dashboard)
apps/admin/lib/require-admin-session.ts
apps/admin/lib/s3cloud.ts
packages/types
packages/database
```

Also inspect:

- the shared shadcn/ui package;
- existing toast usage;
- existing form patterns;
- existing import aliases;
- the current dashboard layout and sidebar;
- relevant `package.json` scripts.

Use the actual APIs and exports found in the repository.

Do not invent missing APIs.

---

## Domain schemas and types

All domain Zod schemas, DTO schemas, and inferred domain types already exist in:

```text
packages/types/src
```

Mandatory rules:

- import domain Zod schemas from `packages/types`;
- import DTO types from `packages/types`;
- import entity types from `packages/types`;
- do not recreate these schemas in `apps/admin`;
- do not recreate equivalent domain interfaces in `apps/admin`;
- do not duplicate locale, translation, create DTO, or update DTO schemas;
- do not manually maintain types that can be inferred from existing schemas.

A small local infrastructure type such as `ActionResult` is allowed because it is not a domain model.

Example:

```ts
export type ActionResult<T = undefined> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

Do not use:

- `any`;
- `as unknown as`;
- `@ts-ignore`;
- `@ts-expect-error` unless the reason is unavoidable and explicitly documented;
- duplicated interfaces that mirror Prisma or Zod models.

---

## Prisma

Use the existing Prisma Client exported from:

```text
packages/database
```

Inspect the actual package exports before importing it.

Mandatory rules:

- do not create another Prisma Client;
- do not instantiate `PrismaClient` inside entity modules;
- do not modify the Prisma schema;
- do not add migrations;
- do not add unique constraints;
- do not add singleton-specific database fields;
- do not create seed data;
- do not change relations or cascade behavior.

Queries must load only required relations.

When loading ordered nested collections, use:

```ts
orderBy: {
  position: "asc",
}
```

Do not return unnecessary reverse relations.

---

## Authentication and authorization

The dashboard layout is protected, but that is not sufficient for mutations.

Every mutating Server Action must call the existing helper from:

```text
apps/admin/lib/require-admin-session.ts
```

This applies to:

- create;
- update;
- delete;
- reorder actions, if any are introduced;
- upload-related mutations, when they are implemented locally.

Inspect the helper signature before using it.

Do not duplicate authentication logic.

Do not trust client-provided user IDs, roles, or authorization flags.

---

## Server Actions

Mutations must use Server Actions.

Each mutation must:

1. contain `"use server"` at the correct module boundary;
2. call `requireAdminSession`;
3. validate untrusted input with the existing Zod DTO schema from `packages/types`;
4. use Prisma from `packages/database`;
5. return a serializable result;
6. handle expected errors without exposing internal Prisma messages;
7. call `revalidatePath` after successful mutations;
8. never call `redirect()`.

Navigation after successful create or update must happen in the client form with `useRouter`.

Handle at least:

- Zod validation failures;
- Prisma unique constraint conflicts;
- missing records;
- unknown server errors.

Return field-level Zod errors where possible.

Do not expose:

- stack traces;
- raw Prisma errors;
- database connection details;
- internal storage credentials.

Read operations may be plain server-side query functions when a Server Action is unnecessary.

---

## Client navigation

After successful create:

1. show a success toast;
2. navigate to the entity list on the client;
3. refresh the router when needed.

After successful update:

1. show a success toast;
2. navigate to the entity list on the client.

After successful delete:

1. show a success toast;
2. refresh the current list.

Do not navigate from inside a Server Action.

---

## Dashboard navigation

The dashboard home page must contain four main cards:

- О нас;
- Проекты;
- Аренда;
- Команда.

The sidebar must contain only these four main entries.

Do not place every individual entity in the main sidebar.

Required section routes:

```text
/about
/projects
/rental
/team
```

Section pages contain navigation cards for their entities without statistics.

Do not add:

- record counts;
- translation completion indicators;
- last-updated statistics;
- analytics;
- dashboard charts.

---

## Entity routes

Collection entities normally use:

```text
/entity
/entity/new
/entity/[id]/edit
```

Keep entity-specific code close to its route.

A valid local organization is:

```text
entity/
├── page.tsx
├── new/
│   └── page.tsx
├── [id]/
│   └── edit/
│       └── page.tsx
├── _actions/
├── _components/
└── _lib/
```

Follow an existing repository pattern when one already exists.

Do not create an additional application-level architecture without a concrete need.

---

## Entity groups

### About

```text
/about/charity
/about/events
/about/partners
/about/thank-you-notes
```

Entities:

- `CharityContent`;
- `EventsContent`;
- `PartnerContent`;
- `ThankYouNoteContent`.

### Projects

```text
/projects/artists
/projects/concerts
/projects/exhibitions
/projects/festival
/projects/holiday-shows
/projects/masterclasses
/projects/performances
/projects/pryalochka-of-time
/projects/usta
```

Entities:

- `ArtistContent`;
- `ConcertContent`;
- `ExhibitionContent`;
- `FestivalContent`;
- `HolidayShowContent`;
- `MasterclassesContent`;
- `PerformancesContent`;
- `PryalochkaOfTimeContent`;
- `UstaContent`.

### Rental

```text
/rental/attraction
/rental/mascot-costume
/rental/requisite
```

Entities:

- `AttractionContent`;
- `MascotCostumeContent`;
- `RequisiteContent`.

### Team

```text
/team
```

Entity:

- `TeamMember`.

---

## Singleton entities

Only these root entities are singletons in the admin UI:

- `UstaContent`;
- `PryalochkaOfTimeContent`.

Singleton behavior:

- when no record exists, show the create form;
- when exactly one record exists, show the edit form;
- when more than one record exists, show a configuration error;
- never silently select the first or newest record;
- do not allow creating another record through the UI;
- do not modify the Prisma schema to enforce singleton behavior.

The configuration error must explain that multiple singleton records were found and require manual database correction.

---

## EventsContent semantics

One `EventsContent` record represents one year.

Example:

```ts
{
  year: "2025",
  events: [
    // all events for 2025
  ],
}
```

Do not create one `EventsContent` per nested event.

The list page displays year cards.

The edit page manages:

- `year`;
- the complete nested `events` array.

Treat `year` as unique at the application level:

- reject duplicate years during create;
- reject duplicate years during update, excluding the current record;
- do not modify the Prisma schema.

---

## Forms

Use:

- React Hook Form;
- `zodResolver`;
- existing DTO schemas from `packages/types`;
- `useFieldArray` for dynamic nested collections;
- one-column layout;
- inline field errors;
- disabled submit state;
- clear loading state.

Form action buttons:

- `Отменить`;
- `Сохранить`.

Do not add:

- draft saving;
- autosave;
- save-and-continue;
- schema-driven universal form renderers;
- generic CRUD form factories.

Small explicit duplication is preferable to opaque abstractions.

---

## Locales and translations

Supported locales:

```ts
ru;
en;
```

Translation UI must use tabs:

```text
Русский
English
```

Rules:

- Russian is selected by default;
- both translations are mandatory when creating a record;
- both translations are validated before submission;
- shared fields remain outside locale tabs;
- only translated fields belong inside locale tabs;
- all translations are saved by the same submit button;
- do not create separate routes or forms for each locale.

Use existing schemas and types for translation values.

---

## Images and MinIO

The existing MinIO/S3 implementation is located at:

```text
apps/admin/lib/s3cloud.ts
```

Inspect and reuse its actual API.

Do not create:

- a second S3 client;
- a second storage configuration;
- an alternative upload API without necessity;
- duplicate upload credentials.

Image requirements:

- drag-and-drop is used only as a file dropzone;
- image preview is required;
- maximum file size is 4 MB per image;
- accept only image MIME types;
- no limit on the number of images unless the entity field is singular;
- store the full uploaded URL in the database;
- allow removing an image URL from the form;
- allow reordering with up/down buttons;
- do not implement drag-and-drop sorting.

When an image is removed:

- remove only its URL from the submitted database value;
- do not physically delete the object from MinIO.

For single image fields, use a single-image field.

For image arrays, use a multi-image field.

Fields named `achievements` contain image URLs and must use the image uploader.

---

## Videos and links

Video arrays contain external URLs, primarily:

- YouTube;
- Rutube.

Represent videos as a dynamic URL list.

Allow:

- adding;
- editing;
- removing;
- moving up;
- moving down.

Do not upload videos to MinIO.

Do not introduce validation stricter than the existing Zod DTO schema unless explicitly requested.

Other string URL arrays, such as social links or team links, should use a simple dynamic URL field.

---

## Ordering

Do not implement drag-and-drop sorting.

Use buttons:

- move up;
- move down.

Ordering changes must remain in local form state until the main form is saved.

On submission:

- derive `position` from the current array order;
- store positions consistently;
- load ordered records with `position ASC`.

Apply this to nested collections and ordered media where order matters.

---

## Nested aggregates

Complex root entities must be edited as one aggregate on one page.

Do not create separate CRUD pages for nested records.

This applies to nested records inside:

- `EventsContent`;
- `FestivalContent`;
- `PerformancesContent`;
- `PryalochkaOfTimeContent`;
- `RequisiteContent`.

All nested changes are saved through one root form and one root mutation.

Deleting a nested item in the form must:

1. remove it from local form state;
2. make no immediate database mutation;
3. delete it from the database only after the root form is saved successfully.

Cancelling the form must leave the database unchanged.

---

## Nested update algorithm

Use a Prisma transaction for complex aggregate updates.

For every nested collection:

1. load existing child records;
2. collect IDs supplied by the update DTO;
3. delete existing children whose IDs are absent from the submitted DTO;
4. update submitted children that have an existing ID;
5. create submitted children without an ID;
6. synchronize translations;
7. recalculate `position` from array order;
8. execute the complete operation inside one transaction.

Do not use full `deleteMany` followed by complete recreation when existing IDs can be preserved.

For nullable one-to-one festival sections:

- nominations;
- jury;
- organizations;

support:

- create when previously absent;
- update when present;
- delete when removed from the submitted form.

---

## FestivalContent

`FestivalContent` must be edited on one page.

The form includes:

- logo;
- manually entered slug;
- images;
- videos;
- achievements as images;
- socials;
- translations;
- events;
- nominations;
- jury;
- jury persons;
- organizations;
- organization items.

The slug:

- is entered manually;
- is not generated automatically;
- is not silently transformed from the title.

Do not create separate routes for festival subsections.

---

## Lists

Entity list pages use cards, not tables.

A card may include:

- first image or placeholder;
- Russian title;
- short Russian text when no title exists;
- year for `EventsContent`;
- edit action;
- delete action.

Do not implement:

- search;
- filtering;
- sorting controls;
- pagination;
- bulk actions;
- row selection;
- mobile-specific card variants.

---

## Root entity deletion

Deletion must require a shadcn confirmation dialog.

The dialog should include:

- entity name;
- record title or a meaningful fallback;
- irreversible action warning;
- cancel button;
- delete button.

Do not implement soft delete.

Use existing Prisma cascade behavior for related database rows.

Do not physically delete MinIO objects.

---

## Shared components

Create a shared component only when it has a clear reusable responsibility and is used by multiple entities.

Reasonable shared components include:

- `LocaleTabs`;
- `ImageUploader`;
- `ImagesField`;
- `VideoUrlsField`;
- `StringListField`;
- `MoveItemButtons`;
- `DeleteConfirmDialog`;
- `FormActions`;
- `EntityPageHeader`;
- `EmptyState`.

Do not create:

- a schema-driven form engine;
- a generic CRUD factory;
- a generic nested relation synchronization framework;
- abstractions that obscure entity-specific behavior.

Entity forms should remain readable without following multiple abstraction layers.

---

## UI and design

Use the existing admin visual language.

The target style is:

- neutral;
- minimal;
- clear;
- functional;
- desktop-focused.

Do not implement:

- dark mode;
- mobile-specific adaptation;
- breadcrumbs;
- decorative animations;
- excessive gradients;
- unnecessary dashboards or statistics.

Use existing shared shadcn components rather than recreating UI primitives.

---

## Error, loading, and empty states

Implement appropriate:

- loading states;
- disabled submit states;
- empty list states;
- missing-record handling;
- user-readable server errors;
- success and error toasts;
- singleton configuration errors.

Use `notFound()` where an edit route references a nonexistent root record and this matches the existing project convention.

Do not leave blank pages or raw errors.

---

## Code quality

Required:

- strict TypeScript;
- no `any`;
- no duplicated domain schemas;
- no unused imports;
- no dead code;
- no placeholder implementations;
- no commented-out alternatives;
- no unrequested features;
- no TODO markers when finishing a phase;
- clear file and function names;
- small, explicit functions;
- narrow Prisma queries;
- predictable error handling.

Avoid giant files when a form can be split into meaningful entity-specific sections.

Do not split simple files without a practical reason.

---

## Scope discipline

Implement only the phase explicitly requested by the current prompt.

For example:

- when asked for dashboard structure, do not implement CRUD;
- when asked for `PartnerContent`, do not implement other entities;
- when asked for one complex aggregate, do not refactor all existing forms;
- when asked for an audit, do not modify code.

Do not proactively add future-phase files.

Do not rewrite working code outside the current scope.

---

## Verification

After every implementation phase:

1. inspect the resulting diff;
2. run the relevant TypeScript typecheck command;
3. run the relevant ESLint command;
4. fix all errors introduced by the phase;
5. confirm that no Prisma schema changes were made;
6. confirm that no domain schemas or types were duplicated;
7. confirm that all mutation actions call `requireAdminSession`;
8. confirm that no Server Action calls `redirect()`.

Discover the correct commands from repository `package.json` files.

Do not invent commands when workspace scripts already exist.

Do not hide compilation or lint errors with casts or disabled rules.

At the end of each phase, report:

- files created;
- files modified;
- commands executed;
- typecheck result;
- lint result;
- remaining blockers, only when real blockers exist.
