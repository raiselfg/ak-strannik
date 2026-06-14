import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@strannik/ui/lib/utils";
import { Header } from "@/components/header";
import { ReactNode, Suspense } from "react";
import dynamic from "next/dynamic";
import "@/app/globals.css";

const Starfield = dynamic(() => import("@/components/starfield"));
const ContactsSection = dynamic(() => import("@/components/contacts-section"));

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <Starfield count={70} maxSize={2} />
          <Starfield count={45} minSize={1.4} maxSize={3.4} />
        </div>
        <main className="flex flex-col gap-12 px-3 md:gap-24 md:px-0">
          <Header />
          {children}
          <Suspense fallback={null}>
            <ContactsSection />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
