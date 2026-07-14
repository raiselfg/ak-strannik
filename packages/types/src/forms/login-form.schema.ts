import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
