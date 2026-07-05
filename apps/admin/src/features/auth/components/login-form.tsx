import { LoginFormSchema, type LoginFormValues } from '@ak-strannik/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Input } from '@ak-strannik/ui/components/input';
import { Label } from '@ak-strannik/ui/components/label';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { LoaderCircle, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ApiError } from '../../../shared/api/api-error';
import { useAuthActions, useAuthState } from '../hooks/use-auth';
import { getAuthErrorMessage } from '../lib/auth-error-messages';

export function LoginForm() {
  const { login } = useAuthActions();
  const { isLoginPending } = useAuthState();
  const navigate = useNavigate();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      await router.invalidate();
      await navigate({ to: '/', replace: true });
    } catch (error) {
      if (!(error instanceof ApiError)) {
        toast.error('Не удалось выполнить вход');
        return;
      }

      let hasFieldError = false;
      for (const [field, messages] of Object.entries(error.fields ?? {})) {
        if ((field === 'login' || field === 'password') && messages[0]) {
          form.setError(field, { type: 'server', message: messages[0] });
          hasFieldError = true;
        }
      }

      const message = getAuthErrorMessage(error.code);
      if (message) {
        form.setError('root.server', { type: 'server', message });
      } else if (!hasFieldError) {
        toast.error(error.message);
      }
    }
  });

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Вход в панель управления</CardTitle>
        <CardDescription>
          Введите данные администратора AK Strannik
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="email"
              autoComplete="username"
              aria-invalid={Boolean(form.formState.errors.login)}
              aria-errormessage={
                form.formState.errors.login ? 'login-error' : undefined
              }
              {...form.register('login')}
            />
            {form.formState.errors.login?.message ? (
              <p
                id="login-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {form.formState.errors.login.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              aria-errormessage={
                form.formState.errors.password ? 'password-error' : undefined
              }
              {...form.register('password')}
            />
            {form.formState.errors.password?.message ? (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {form.formState.errors.root?.server?.message ? (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </p>
          ) : null}

          <Button className="w-full" type="submit" disabled={isLoginPending}>
            {isLoginPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <LogIn />
            )}
            Войти
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
