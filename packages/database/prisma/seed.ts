import { createHash } from 'node:crypto';

import {
  DEFAULT_LOCALE,
  EVENT_SEEDS,
  LOCAL_MEDIA,
  LOCALES,
  PAGE_SEEDS,
  PARTNER_SEEDS,
  PROJECT_SEEDS,
  PUBLISHED_AT,
  REDIRECT_SEEDS,
  RENTAL_SEEDS,
  SITE_SETTINGS,
  TEAM_MEMBERS,
} from './constants/index.js';
import { prisma } from '../src/client.js';

const publishedAt = new Date(PUBLISHED_AT);

function uuidFor(seedKey: string) {
  const hash = createHash('sha1').update(seedKey).digest('hex');
  const chars = hash.slice(0, 32).split('');

  chars[12] = '5';
  chars[16] = ((Number.parseInt(chars[16] ?? '0', 16) & 0x3) | 0x8).toString(16);

  return [
    chars.slice(0, 8).join(''),
    chars.slice(8, 12).join(''),
    chars.slice(12, 16).join(''),
    chars.slice(16, 20).join(''),
    chars.slice(20, 32).join(''),
  ].join('-');
}

async function recordSeed(seedKey: string, entityType: string, entityId: string) {
  await prisma.contentSeedRegistry.upsert({
    where: { seedKey },
    create: {
      id: uuidFor(`registry:${seedKey}`),
      seedKey,
      entityType,
      entityId,
    },
    update: {
      entityType,
      entityId,
    },
  });
}

async function seedContentDocument(
  seedKey: string,
  blocks: readonly { type: string; settings?: unknown; payload: unknown }[] = [],
) {
  const documentId = uuidFor(`content-document:${seedKey}`);

  await prisma.contentDocument.upsert({
    where: { id: documentId },
    create: { id: documentId },
    update: {},
  });

  await prisma.contentBlock.deleteMany({ where: { documentId } });

  if (blocks.length > 0) {
    await prisma.contentBlock.createMany({
      data: blocks.map((block, index) => ({
        id: uuidFor(`content-block:${seedKey}:${index}`),
        documentId,
        type: block.type,
        sortOrder: index,
        settings: (block.settings ?? {}) as object,
        payload: block.payload as object,
      })),
    });
  }

  await recordSeed(`content-document:${seedKey}`, 'ContentDocument', documentId);

  return documentId;
}

async function seedLocales() {
  for (const locale of LOCALES) {
    await prisma.locale.upsert({
      where: { code: locale.code },
      create: locale,
      update: locale,
    });
  }
}

async function seedMedia() {
  for (const media of LOCAL_MEDIA) {
    const mediaId = uuidFor(`media:${media.key}`);

    await prisma.mediaAsset.upsert({
      where: {
        bucket_objectKey: {
          bucket: 'public',
          objectKey: media.objectKey,
        },
      },
      create: {
        id: mediaId,
        kind: 'image',
        bucket: 'public',
        objectKey: media.objectKey,
        originalFilename: media.objectKey.replace(/^\//, ''),
        contentType: media.contentType,
        sizeBytes: BigInt(media.sizeBytes),
        status: 'ready',
      },
      update: {
        contentType: media.contentType,
        sizeBytes: BigInt(media.sizeBytes),
        status: 'ready',
      },
    });

    await prisma.mediaAssetTranslation.upsert({
      where: {
        mediaAssetId_localeCode: {
          mediaAssetId: mediaId,
          localeCode: DEFAULT_LOCALE,
        },
      },
      create: {
        mediaAssetId: mediaId,
        localeCode: DEFAULT_LOCALE,
        title: media.key,
        altText: media.key,
      },
      update: {
        title: media.key,
        altText: media.key,
      },
    });

    await recordSeed(`media:${media.key}`, 'MediaAsset', mediaId);
  }
}

function mediaIdFor(mediaKey: string | null | undefined) {
  return mediaKey ? uuidFor(`media:${mediaKey}`) : null;
}

async function seedSiteSettings() {
  const settingId = uuidFor('site-settings:singleton');

  await prisma.siteSetting.upsert({
    where: { singleton: true },
    create: {
      id: settingId,
      singleton: true,
      email: SITE_SETTINGS.email,
      phone: SITE_SETTINGS.phone,
      telegramUrl: SITE_SETTINGS.telegramUrl,
      vkUrl: SITE_SETTINGS.vkUrl,
      youtubeUrl: SITE_SETTINGS.youtubeUrl,
      addressLatitude: SITE_SETTINGS.addressLatitude,
      addressLongitude: SITE_SETTINGS.addressLongitude,
    },
    update: {
      email: SITE_SETTINGS.email,
      phone: SITE_SETTINGS.phone,
      telegramUrl: SITE_SETTINGS.telegramUrl,
      vkUrl: SITE_SETTINGS.vkUrl,
      youtubeUrl: SITE_SETTINGS.youtubeUrl,
      addressLatitude: SITE_SETTINGS.addressLatitude,
      addressLongitude: SITE_SETTINGS.addressLongitude,
    },
  });

  for (const [localeCode, translation] of Object.entries(
    SITE_SETTINGS.translations,
  )) {
    await prisma.siteSettingTranslation.upsert({
      where: {
        siteSettingId_localeCode: {
          siteSettingId: settingId,
          localeCode,
        },
      },
      create: {
        siteSettingId: settingId,
        localeCode,
        ...translation,
      },
      update: translation,
    });
  }

  await recordSeed('site-settings:singleton', 'SiteSetting', settingId);
}

async function seedPages() {
  for (const page of PAGE_SEEDS) {
    const pageId = uuidFor(`page:${page.code}`);
    const bodyDocumentId = await seedContentDocument(
      `page:${page.code}`,
      page.blocks,
    );

    await prisma.page.upsert({
      where: { code: page.code },
      create: {
        id: pageId,
        code: page.code,
        status: 'active',
      },
      update: {
        status: 'active',
      },
    });

    for (const [localeCode, translation] of Object.entries(page.translations)) {
      await prisma.pageTranslation.upsert({
        where: {
          pageId_localeCode: {
            pageId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`page-translation:${page.code}:${localeCode}`),
          pageId,
          localeCode,
          title: translation.title,
          slug: translation.slug,
          bodyDocumentId,
          seoTitle: translation.seoTitle,
          seoDescription: translation.seoDescription,
          status: 'published',
          publishedAt,
        },
        update: {
          title: translation.title,
          slug: translation.slug,
          bodyDocumentId,
          seoTitle: translation.seoTitle,
          seoDescription: translation.seoDescription,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`page:${page.code}`, 'Page', pageId);
  }
}

async function seedTeam() {
  for (const member of TEAM_MEMBERS) {
    const personId = uuidFor(`person:${member.key}`);
    const membershipId = uuidFor(`team-membership:${member.key}`);

    await prisma.person.upsert({
      where: { id: personId },
      create: {
        id: personId,
        avatarMediaId: mediaIdFor(member.mediaKey),
        status: 'active',
      },
      update: {
        avatarMediaId: mediaIdFor(member.mediaKey),
        status: 'active',
      },
    });

    for (const [localeCode, translation] of Object.entries(member.translations)) {
      await prisma.personTranslation.upsert({
        where: {
          personId_localeCode: {
            personId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`person-translation:${member.key}:${localeCode}`),
          personId,
          localeCode,
          fullName: translation.fullName,
          slug: translation.slug,
          shortBio: translation.shortBio ?? null,
          status: 'published',
          publishedAt,
        },
        update: {
          fullName: translation.fullName,
          slug: translation.slug,
          shortBio: translation.shortBio ?? null,
          status: 'published',
          publishedAt,
        },
      });
    }

    await prisma.teamMembership.upsert({
      where: { personId },
      create: {
        id: membershipId,
        personId,
        status: 'active',
        sortOrder: member.sortOrder,
      },
      update: {
        status: 'active',
        sortOrder: member.sortOrder,
      },
    });

    for (const [localeCode, translation] of Object.entries(member.translations)) {
      await prisma.teamMembershipTranslation.upsert({
        where: {
          teamMembershipId_localeCode: {
            teamMembershipId: membershipId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`team-membership-translation:${member.key}:${localeCode}`),
          teamMembershipId: membershipId,
          localeCode,
          roleTitle: translation.roleTitle,
          status: 'published',
          publishedAt,
        },
        update: {
          roleTitle: translation.roleTitle,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`person:${member.key}`, 'Person', personId);
    await recordSeed(
      `team-membership:${member.key}`,
      'TeamMembership',
      membershipId,
    );
  }
}

async function seedPartners() {
  for (const partner of PARTNER_SEEDS) {
    const partnerId = uuidFor(`partner:${partner.key}`);

    await prisma.partner.upsert({
      where: { id: partnerId },
      create: {
        id: partnerId,
        websiteUrl: partner.websiteUrl,
        status: 'active',
        sortOrder: partner.sortOrder,
      },
      update: {
        websiteUrl: partner.websiteUrl,
        status: 'active',
        sortOrder: partner.sortOrder,
      },
    });

    for (const [localeCode, translation] of Object.entries(
      partner.translations,
    )) {
      await prisma.partnerTranslation.upsert({
        where: {
          partnerId_localeCode: {
            partnerId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`partner-translation:${partner.key}:${localeCode}`),
          partnerId,
          localeCode,
          ...translation,
          status: 'published',
          publishedAt,
        },
        update: {
          ...translation,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`partner:${partner.key}`, 'Partner', partnerId);
  }
}

async function seedProjects() {
  for (const project of PROJECT_SEEDS) {
    const projectId = uuidFor(`project:${project.key}`);
    const bodyDocumentId = await seedContentDocument(
      `project:${project.key}`,
      'blocks' in project ? project.blocks : [],
    );

    await prisma.project.upsert({
      where: { id: projectId },
      create: {
        id: projectId,
        kind: project.kind,
        showcaseCategory: project.showcaseCategory,
        status: 'active',
        sortOrder: project.sortOrder,
      },
      update: {
        kind: project.kind,
        showcaseCategory: project.showcaseCategory,
        status: 'active',
        sortOrder: project.sortOrder,
      },
    });

    for (const [localeCode, translation] of Object.entries(project.translations)) {
      await prisma.projectTranslation.upsert({
        where: {
          projectId_localeCode: {
            projectId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`project-translation:${project.key}:${localeCode}`),
          projectId,
          localeCode,
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          bodyDocumentId,
          status: 'published',
          publishedAt,
        },
        update: {
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          bodyDocumentId,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`project:${project.key}`, 'Project', projectId);
  }
}

async function seedEvents() {
  for (const event of EVENT_SEEDS) {
    const eventId = uuidFor(`event:${event.key}`);

    await prisma.event.upsert({
      where: { id: eventId },
      create: {
        id: eventId,
        startsAt: new Date(event.startsAt),
        timezone: event.timezone,
        isAllDay: false,
        status: 'active',
        sortOrder: event.sortOrder,
      },
      update: {
        startsAt: new Date(event.startsAt),
        timezone: event.timezone,
        isAllDay: false,
        status: 'active',
        sortOrder: event.sortOrder,
      },
    });

    for (const [localeCode, translation] of Object.entries(event.translations)) {
      await prisma.eventTranslation.upsert({
        where: {
          eventId_localeCode: {
            eventId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`event-translation:${event.key}:${localeCode}`),
          eventId,
          localeCode,
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          status: 'published',
          publishedAt,
        },
        update: {
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`event:${event.key}`, 'Event', eventId);
  }
}

async function seedRentals() {
  for (const rental of RENTAL_SEEDS) {
    const rentalItemId = uuidFor(`rental-item:${rental.key}`);

    await prisma.rentalItem.upsert({
      where: { id: rentalItemId },
      create: {
        id: rentalItemId,
        category: rental.category,
        status: 'active',
        sortOrder: rental.sortOrder,
      },
      update: {
        category: rental.category,
        status: 'active',
        sortOrder: rental.sortOrder,
      },
    });

    for (const [localeCode, translation] of Object.entries(rental.translations)) {
      await prisma.rentalItemTranslation.upsert({
        where: {
          rentalItemId_localeCode: {
            rentalItemId,
            localeCode,
          },
        },
        create: {
          id: uuidFor(`rental-item-translation:${rental.key}:${localeCode}`),
          rentalItemId,
          localeCode,
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          status: 'published',
          publishedAt,
        },
        update: {
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          status: 'published',
          publishedAt,
        },
      });
    }

    await recordSeed(`rental-item:${rental.key}`, 'RentalItem', rentalItemId);
  }
}

async function seedRedirects() {
  for (const redirect of REDIRECT_SEEDS) {
    const redirectId = uuidFor(`redirect:${redirect.fromPath}`);

    await prisma.redirect.upsert({
      where: { fromPath: redirect.fromPath },
      create: {
        id: redirectId,
        fromPath: redirect.fromPath,
        toPath: redirect.toPath,
        httpStatus: 301,
        isActive: true,
      },
      update: {
        toPath: redirect.toPath,
        httpStatus: 301,
        isActive: true,
      },
    });

    await recordSeed(`redirect:${redirect.fromPath}`, 'Redirect', redirectId);
  }
}

async function main() {
  await seedLocales();
  await seedMedia();
  await seedSiteSettings();
  await seedPages();
  await seedTeam();
  await seedPartners();
  await seedProjects();
  await seedEvents();
  await seedRentals();
  await seedRedirects();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
