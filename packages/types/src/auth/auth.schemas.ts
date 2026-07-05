import { z } from 'zod';

import { AuthenticatedSchema } from '../common/primitives';

export const AdminLoginRequestSchema = z.object({
  login: z.email(),
  password: z.string().min(1),
});

export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>;

export const AdminLoginResponseSchema = z.object({
  authenticated: AuthenticatedSchema,
  csrfToken: z.string().min(1),
});

export type AdminLoginResponse = z.infer<typeof AdminLoginResponseSchema>;

export const AdminMeResponseSchema = z.object({
  authenticated: AuthenticatedSchema,
  login: z.email(),
  csrfToken: z.string().min(1),
});

export type AdminMeResponse = z.infer<typeof AdminMeResponseSchema>;
