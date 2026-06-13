import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@workspace/ui/lib/utils"
import { Starfield } from "@/components/starfield"
import "@/app/globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
        {children}
      </body>
    </html>
  )
}
