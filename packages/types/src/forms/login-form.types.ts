import z from 'zod';
import { LoginFormSchema } from './login-form.schema';

export type LoginForm = z.infer<typeof LoginFormSchema>;
