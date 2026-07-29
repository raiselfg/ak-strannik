import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import VkIcon from '@/app/_components/layout/icons/vk-icon';
import YoutubeIcon from '@/app/_components/layout/icons/yt-icon';
import { ContactRow, SocialLink } from './contact-link';
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
    <section
      id="contacts"
      className="relative overflow-hidden px-4 pt-20 pb-8 sm:px-6 lg:px-8"
    >
      <div className="via-gold/60 absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent to-transparent" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_10%,var(--color-gold)/0.12,transparent_30%),linear-gradient(180deg,transparent,var(--color-ink)_70%)]" />

      <div className="container mx-auto">
        <div className="overflow-hidden rounded-[2rem] border border-border/45 bg-card/45 shadow-2xl shadow-background/35 backdrop-blur-md lg:rounded-[3rem]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-10 p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
                  {t('eyebrow')}
                </p>
                <h2 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
                  {t('title')}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                  {t('description')}
                </p>
              </div>

              <div className="grid gap-3">
                <ContactRow
                  icon={<Phone className="size-5" strokeWidth={1.5} />}
                  label={t('phoneLabel')}
                  value={contacts.phone.display}
                  href={contacts.phone.href}
                />
                <ContactRow
                  icon={<Mail className="size-5" strokeWidth={1.5} />}
                  label={t('emailLabel')}
                  value={contacts.email.display}
                  href={contacts.email.href}
                />
                <ContactRow
                  icon={<MapPin className="size-5" strokeWidth={1.5} />}
                  label={t('addressLabel')}
                  value={t('address')}
                  note={t('addressNote')}
                />
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-border/35 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt=""
                    height={52}
                    width={52}
                    className="size-13"
                  />
                  <div>
                    <p className="font-hand text-2xl leading-none font-bold">
                      {t('brand')}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                      {t('brandCaption')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {t('socialTitle')}
                  </p>
                  <div className="flex gap-3">
                    <SocialLink href={contacts.socials.vk} label={t('vkLabel')}>
                      <VkIcon />
                    </SocialLink>
                    <SocialLink
                      href={contacts.socials.youtube}
                      label={t('youtubeLabel')}
                    >
                      <YoutubeIcon />
                    </SocialLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/45 bg-background/25 p-3 lg:border-t-0 lg:border-l">
              <div className="relative h-full min-h-110 overflow-hidden rounded-[1.5rem] border border-border/45 bg-muted/20 lg:rounded-[2.25rem]">
                <div className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase">
                      {t('mapEyebrow')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('mapDescription')}
                    </p>
                  </div>
                  <MapPin className="text-gold size-5" strokeWidth={1.5} />
                </div>
                <YandexMap
                  className="h-full min-h-110 w-full"
                  apiKey={YANDEX_MAPS_API_KEY}
                  center={MAP_CENTER}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
