"use client"

import * as React from "react"
import { Phone, Mail, MapPin, FileText } from "lucide-react"
import dynamic from "next/dynamic"

import { contacts } from "@/lib/constants"
import { VkIcon, YoutubeIcon } from "@/components/icons"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

const YandexMap = dynamic(
  () => import("@/components/yandex-map").then((m) => m.YandexMap),
  { ssr: false }
)

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || ""
const MAP_CENTER: [number, number] = [59.928686, 30.370513]

export function ContactsSection() {
  return (
    <section id="contacts" className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ЛЕВАЯ КОЛОНКА: Контакты */}
          <div className="flex flex-col items-start gap-8">
            <h2 className="font-hand text-5xl leading-[0.95] font-bold tracking-[0.5px] md:text-7xl">
              Контакты
            </h2>

            <ul className="flex flex-col gap-6">
              <li className="flex items-center gap-4">
                <IconBox>
                  <Phone className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </IconBox>
                <a
                  href={contacts.phone.href}
                  className="hover:text-gold text-lg font-medium transition-colors md:text-xl"
                >
                  {contacts.phone.display}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <IconBox>
                  <Mail className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </IconBox>
                <a
                  href={contacts.email.href}
                  className="hover:text-gold text-lg font-medium transition-colors md:text-xl"
                >
                  {contacts.email.display}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <IconBox>
                  <MapPin className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </IconBox>
                <div className="flex flex-col justify-center">
                  <span className="text-lg font-medium md:text-xl">
                    {contacts.address}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {contacts.addressNote}
                  </span>
                </div>
              </li>

              <li className="mt-2 flex gap-4">
                <IconBox>
                  <SocialLink
                    href={contacts.socials.vk}
                    target="_blank"
                    label="ВКонтакте"
                  >
                    <VkIcon className="h-8 w-8" />
                  </SocialLink>
                </IconBox>
                <IconBox>
                  <SocialLink
                    href={contacts.socials.youtube}
                    target="_blank"
                    label="YouTube"
                  >
                    <YoutubeIcon />
                  </SocialLink>
                </IconBox>
              </li>
            </ul>

            <Button
              variant="link"
              asChild
              className="text-gold mt-4 h-auto p-0 font-normal hover:no-underline"
            >
              <a
                href={contacts.charterHref}
                className="group inline-flex items-center"
              >
                <FileText
                  className="mr-2.5 h-[18px] w-[18px] transition-transform group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
                <span className="border-gold/40 group-hover:border-gold border-b pb-[3px] transition-colors">
                  Устав организации
                </span>
              </a>
            </Button>
          </div>

          <div className="relative h-full min-h-[400px] w-full">
            <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-border/50 shadow-xl">
              <YandexMap
                apiKey={YANDEX_MAPS_API_KEY}
                center={MAP_CENTER}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gold grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-border bg-[rgba(120,135,220,0.07)]">
      {children}
    </span>
  )
}

function SocialLink({
  href,
  label,
  children,
  ...props
}: {
  href: string
  label: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} aria-label={label} {...props}>
      {children}
    </Link>
  )
}
