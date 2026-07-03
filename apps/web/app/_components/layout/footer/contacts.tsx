import { Phone, Mail, MapPin, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';

import { Button } from '@ak-strannik/ui/components/button';
import { Link } from '@/i18n/navigation';
import VkIcon from '@/app/_components/layout/icons/vk-icon';
import YoutubeIcon from '@/app/_components/layout/icons/yt-icon';
import {
  contacts,
  MAP_CENTER,
  YANDEX_MAPS_API_KEY,
} from './constants/constants';

const YandexMap = dynamic(
  () => import('@/app/_components/layout/yandex-map/yandex-map')
);

export default function Contacts() {
  const t = useTranslations('Contacts');

  return (
    <section id="contacts">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <h2 className="font-hand text-center text-4xl leading-[0.95] font-bold tracking-[0.5px] sm:text-5xl md:text-7xl">
              {t('title')}
            </h2>

            <ul className="flex flex-col gap-6">
              <li className="flex items-center gap-4">
                <Phone strokeWidth={1.5} />
                <a
                  href={contacts.phone.href}
                  className="hover:text-gold text-lg font-medium transition-colors md:text-xl"
                >
                  {contacts.phone.display}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <Mail strokeWidth={1.5} />
                <a
                  href={contacts.email.href}
                  className="hover:text-gold text-lg font-medium transition-colors md:text-xl"
                >
                  {contacts.email.display}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <MapPin strokeWidth={1.5} />
                <div className="flex flex-col justify-center">
                  <span className="text-lg font-medium md:text-xl">
                    {t('address')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('addressNote')}
                  </span>
                </div>
              </li>

              <li className="flex gap-4">
                <NextLink
                  href={contacts.socials.vk}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('vkLabel')}
                >
                  <VkIcon />
                </NextLink>

                <NextLink
                  href={contacts.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('youtubeLabel')}
                >
                  <YoutubeIcon />
                </NextLink>
              </li>
            </ul>

            <Button
              variant="link"
              asChild
              className="hover:text-gold h-auto p-0 font-normal text-foreground hover:no-underline"
            >
              <Link
                href={contacts.charterHref}
                className="flex items-center gap-2"
              >
                <FileText strokeWidth={1.5} />
                <span>{t('charter')}</span>
              </Link>
            </Button>
          </div>

          <YandexMap
            className="h-full min-h-100 w-full overflow-hidden rounded-xl border border-border/50 shadow-xl"
            apiKey={YANDEX_MAPS_API_KEY}
            center={MAP_CENTER}
          />
        </div>
      </div>
    </section>
  );
}
