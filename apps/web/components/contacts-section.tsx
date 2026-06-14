import { Phone, Mail, MapPin, FileText } from "lucide-react";
import dynamic from "next/dynamic";

import { contacts } from "@/lib/constants";
import { Button } from "@strannik/ui/components/button";
import Link from "next/link";

const YandexMap = dynamic(() => import("@/components/yandex-map"));

const VkIcon = dynamic(() => import("@/components/vk-icon"));
const YoutubeIcon = dynamic(() => import("@/components/yt-icon"));

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "";
const MAP_CENTER: [number, number] = [59.928686, 30.370513];

export default function ContactsSection() {
  return (
    <section id="contacts">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-8">
            <h2 className="font-hand text-5xl leading-[0.95] font-bold tracking-[0.5px] md:text-7xl">
              Контакты
            </h2>

            <ul className="flex flex-col gap-6">
              <li className="flex items-center gap-4">
                <IconBox>
                  <Phone strokeWidth={1.5} />
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
                  <Mail strokeWidth={1.5} />
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
                  <MapPin strokeWidth={1.5} />
                </IconBox>
                <div className="flex flex-col justify-center">
                  <span className="text-lg font-medium md:text-xl">
                    {contacts.address}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {contacts.addressNote}
                  </span>
                </div>
              </li>

              <li className="flex gap-4">
                <IconBox>
                  <Link
                    href={contacts.socials.vk}
                    target="_blank"
                    aria-label="ВКонтакте"
                  >
                    <VkIcon />
                  </Link>
                </IconBox>
                <IconBox>
                  <Link
                    href={contacts.socials.youtube}
                    target="_blank"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon />
                  </Link>
                </IconBox>
              </li>
            </ul>

            <Button
              variant="link"
              asChild
              className="text-foreground hover:text-gold h-auto p-0 font-normal hover:no-underline"
            >
              <a
                href={contacts.charterHref}
                className="flex items-center gap-2"
              >
                <FileText strokeWidth={1.5} />
                <span>Устав организации</span>
              </a>
            </Button>
          </div>

          <YandexMap
            className="border-border/50 h-full w-full overflow-hidden rounded-xl border shadow-xl"
            apiKey={YANDEX_MAPS_API_KEY}
            center={MAP_CENTER}
          />
        </div>
      </div>
    </section>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gold border-border grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border bg-[rgba(120,135,220,0.07)]">
      {children}
    </span>
  );
}
