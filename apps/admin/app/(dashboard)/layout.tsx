import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { DashboardShell } from '../_components/dashboard-shell';
import { requireAdminSession } from '../../lib/require-admin-session';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdminSession();
  } catch {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
