-- PostgreSQL enum values must be committed before they can be used reliably.
-- This second stage copies the legacy section data, then removes the old value.

BEGIN;

UPDATE "ProjectSection"
SET
  "variant" = 'video',
  "videoProvider" = 'youtube'::"VideoProvider",
  "videoUrl" = NULLIF(BTRIM("youtubeUrl"), '')
WHERE "variant" = 'youtube';

ALTER TABLE "ProjectSection" ALTER COLUMN "variant" DROP DEFAULT;

CREATE TYPE "ProjectSectionVariant_new" AS ENUM (
  'content',
  'split',
  'gallery',
  'slider',
  'video',
  'quote'
);

ALTER TABLE "ProjectSection"
ALTER COLUMN "variant" TYPE "ProjectSectionVariant_new"
USING ("variant"::text::"ProjectSectionVariant_new");

DROP TYPE "ProjectSectionVariant";
ALTER TYPE "ProjectSectionVariant_new" RENAME TO "ProjectSectionVariant";

ALTER TABLE "ProjectSection"
ALTER COLUMN "variant" SET DEFAULT 'content';

ALTER TABLE "ProjectSection" DROP COLUMN "youtubeUrl";

COMMIT;
