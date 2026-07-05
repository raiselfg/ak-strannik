import { z } from 'zod'

export const LoginFormSchema = z.object({
  login: z.email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>
