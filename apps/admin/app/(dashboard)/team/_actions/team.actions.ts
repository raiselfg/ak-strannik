'use server';
import { Prisma, prisma } from '@ak-strannik/database';
import {
  createTeamMemberDtoSchema,
  type CreateTeamMemberDto,
  updateTeamMemberDtoSchema,
  type UpdateTeamMemberDto,
} from '@ak-strannik/types/team';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../lib/validate-required-locales';
const listPath = '/team';
function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Участник команды не найден' };
  }
  console.error('[TeamMember] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}
export async function createTeamMember(
  input: CreateTeamMemberDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createTeamMemberDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.teamMember.create({
      data: {
        image: parsed.data.image,
        achievements: parsed.data.achievements,
        links: {
          create: parsed.data.links.map((link, position) => ({
            href: link.href,
            position,
            translations: { create: link.translations },
          })),
        },
        translations: {
          create: parsed.data.translations.map(
            ({ bio, locale, name, role }) => ({ bio, locale, name, role })
          ),
        },
      },
    });
    revalidatePath(listPath);
    return { success: true, message: 'Участник команды создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function updateTeamMember(
  id: string,
  input: UpdateTeamMemberDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateTeamMemberDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  const translations = parsed.data.translations;
  if (
    !translations ||
    translations.some(
      (item) => !item.locale || !item.name || !item.role || !item.bio
    )
  )
    return { success: false, message: 'Заполните переводы на двух языках' };
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.teamMember.update({
        where: { id: parsedId.data },
        data: {
          image: parsed.data.image,
          achievements: parsed.data.achievements,
          links: parsed.data.links
            ? {
                deleteMany: {},
                create: parsed.data.links.map((link, position) => ({
                  href: link.href,
                  position,
                  translations: { create: link.translations },
                })),
              }
            : undefined,
        },
      });
      for (const translation of translations) {
        const { bio, locale, name, role } = translation;
        if (!locale || !name || !role || !bio)
          throw new Error('Validated team translation is incomplete');
        await transaction.teamMemberTranslation.upsert({
          where: {
            teamMemberId_locale: { teamMemberId: parsedId.data, locale },
          },
          create: { teamMemberId: parsedId.data, bio, locale, name, role },
          update: { bio, name, role },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Участник команды обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return { success: false, message: 'Некорректный идентификатор участника' };
  try {
    await prisma.teamMember.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Участник команды удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
