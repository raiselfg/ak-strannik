import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '../features/auth/components/login-form'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.checkSession()
    if (user) throw redirect({ to: '/' })
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <LoginForm />
    </main>
  )
}
