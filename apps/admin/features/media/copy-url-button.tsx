'use client';

import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { Copy } from 'lucide-react';

export function CopyUrlButton({ url, size = 'default' }: { url: string; size?: 'default' | 'sm' }) {
  async function copy() {
    try { await navigator.clipboard.writeText(url); toast.success('URL скопирован'); }
    catch { toast.error('Не удалось скопировать URL'); }
  }
  return <Button type="button" size={size} variant="outline" onClick={copy}><Copy />Копировать URL</Button>;
}
