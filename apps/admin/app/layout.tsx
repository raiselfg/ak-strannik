import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { type ReactNode } from 'react';
import { Toaster } from '@ak-strannik/ui/components/sonner';
import { ThemeProvider } from './_components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Панель управления',
    template: '%s | AK Strannik',
  },
  description: 'Административная панель AK Strannik',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" duration={4000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
