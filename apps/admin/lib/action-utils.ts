import { z } from 'zod';
import { requireAdminSession } from './require-admin-session';

export type ActionFailure = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult = { success: true; message?: string } | ActionFailure;

export const idSchema = z.uuid();

export function fieldErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string[]>>((result, issue) => {
    const key = issue.path.join('.');
    if (key) result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

export async function authenticate(): Promise<ActionFailure | null> {
  try {
    await requireAdminSession();
    return null;
  } catch {
    return {
      success: false,
      message: 'Необходимо войти в административную панель',
    };
  }
}
