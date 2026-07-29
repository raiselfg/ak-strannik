CREATE TABLE "TeamMemberLink" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "href" TEXT NOT NULL,
    CONSTRAINT "TeamMemberLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TeamMemberLinkTranslation" (
    "id" TEXT NOT NULL,
    "teamMemberLinkId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "TeamMemberLinkTranslation_pkey" PRIMARY KEY ("id")
);

INSERT INTO "TeamMemberLink" ("id", "teamMemberId", "position", "href")
SELECT gen_random_uuid()::text, member."id", (link.ordinality - 1)::integer, link.href
FROM "TeamMember" AS member
CROSS JOIN LATERAL unnest(member."links") WITH ORDINALITY AS link(href, ordinality);

INSERT INTO "TeamMemberLinkTranslation" ("id", "teamMemberLinkId", "locale", "label")
SELECT gen_random_uuid()::text, link."id", locale.value, link."href"
FROM "TeamMemberLink" AS link
CROSS JOIN (VALUES ('ru'::"Locale"), ('en'::"Locale")) AS locale(value);

ALTER TABLE "TeamMember" DROP COLUMN "links";

CREATE UNIQUE INDEX "TeamMemberLink_teamMemberId_position_key"
ON "TeamMemberLink"("teamMemberId", "position");
CREATE INDEX "TeamMemberLink_teamMemberId_idx"
ON "TeamMemberLink"("teamMemberId");
CREATE UNIQUE INDEX "TeamMemberLinkTranslation_teamMemberLinkId_locale_key"
ON "TeamMemberLinkTranslation"("teamMemberLinkId", "locale");
CREATE INDEX "TeamMemberLinkTranslation_teamMemberLinkId_idx"
ON "TeamMemberLinkTranslation"("teamMemberLinkId");
CREATE INDEX "TeamMemberLinkTranslation_locale_idx"
ON "TeamMemberLinkTranslation"("locale");

ALTER TABLE "TeamMemberLink"
ADD CONSTRAINT "TeamMemberLink_teamMemberId_fkey"
FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TeamMemberLinkTranslation"
ADD CONSTRAINT "TeamMemberLinkTranslation_teamMemberLinkId_fkey"
FOREIGN KEY ("teamMemberLinkId") REFERENCES "TeamMemberLink"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
