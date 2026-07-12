import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '../../lib/auth';
import { LoginForm } from './login-form';

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm space-y-6">
        <p className="text-sm text-foreground/60">Войдите в профиль админа</p>
        <LoginForm />
      </section>
    </main>
  );
}
