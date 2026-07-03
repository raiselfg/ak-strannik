import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@ak-strannik/ui/components/navigation-menu';
import { cn } from '@ak-strannik/ui/lib/utils';
import { Link } from '@/i18n/navigation';

import {
  contactNavLink,
  homeNavLink,
  navGroups,
  type NavLink,
} from './constants/constants';

interface NavMenuProps {
  className?: string;
}

interface MobileNavigationListProps {
  className?: string;
  onItemClick?: () => void;
}

interface HeaderLinkProps {
  link: NavLink;
  label: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

interface DesktopNavLinkProps extends HeaderLinkProps {
  locale: string;
}

export function NavMenu({ className }: NavMenuProps) {
  const locale = useLocale();
  const t = useTranslations('Navigation');

  return (
    <NavigationMenu
      viewport={false}
      className={cn('hidden items-center md:flex', className)}
    >
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <DesktopNavLink
            link={homeNavLink}
            label={t(homeNavLink.labelKey)}
            locale={locale}
            className={navigationMenuTriggerStyle()}
          />
        </NavigationMenuItem>

        {navGroups.map((item) => (
          <NavigationMenuItem key={item.labelKey}>
            <NavigationMenuTrigger>{t(item.labelKey)}</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-72 p-2">
              <ul className="grid gap-1">
                {item.links.map((link) => {
                  const label = t(link.labelKey);

                  return (
                    <li key={link.labelKey}>
                      <DesktopNavLink
                        link={link}
                        label={label}
                        locale={locale}
                        className="min-h-10 min-w-64 justify-between rounded-2xl px-3 py-2.5 font-medium"
                      >
                        <span>{label}</span>
                        {isExternalLink(link) && (
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                        )}
                      </DesktopNavLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <DesktopNavLink
            link={contactNavLink}
            label={t(contactNavLink.labelKey)}
            locale={locale}
            className={navigationMenuTriggerStyle()}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobileNavigationList({
  className,
  onItemClick,
}: MobileNavigationListProps) {
  const t = useTranslations('Navigation');

  return (
    <nav
      aria-label={t('mobileAriaLabel')}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="grid gap-1">
        <MobileNavLink
          link={homeNavLink}
          label={t(homeNavLink.labelKey)}
          onClick={onItemClick}
        />
        <MobileNavLink
          link={contactNavLink}
          label={t(contactNavLink.labelKey)}
          onClick={onItemClick}
        />
      </div>

      {navGroups.map((group) => (
        <section key={group.labelKey} className="grid gap-2">
          <h3 className="px-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {t(group.labelKey)}
          </h3>
          <ul className="grid gap-1">
            {group.links.map((link) => (
              <li key={link.labelKey}>
                <MobileNavLink
                  link={link}
                  label={t(link.labelKey)}
                  onClick={onItemClick}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

function DesktopNavLink({
  link,
  label,
  locale,
  className,
  children = label,
}: DesktopNavLinkProps) {
  const externalProps = isExternalLink(link)
    ? { target: '_blank', rel: 'noreferrer' }
    : undefined;

  return (
    <NavigationMenuLink
      href={getLocalizedHref(link, locale)}
      className={className}
      {...externalProps}
    >
      {children}
    </NavigationMenuLink>
  );
}

function MobileNavLink({ link, label, onClick }: HeaderLinkProps) {
  return (
    <HeaderLink
      link={link}
      label={label}
      onClick={onClick}
      className="flex min-h-11 items-center justify-between rounded-2xl px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    >
      <span>{label}</span>
      {isExternalLink(link) && (
        <ExternalLink className="size-4 text-muted-foreground" />
      )}
    </HeaderLink>
  );
}

function HeaderLink({
  link,
  label,
  className,
  onClick,
  children = label,
}: HeaderLinkProps) {
  if (isExternalLink(link)) {
    return (
      <NextLink
        href={link.href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </NextLink>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function getLocalizedHref(link: NavLink, locale: string) {
  if (isExternalLink(link) || locale === 'ru') return link.href;
  if (link.href === '/') return '/en';
  if (link.href.startsWith('/#')) return `/en${link.href.slice(1)}`;
  if (link.href.startsWith('/')) return `/en${link.href}`;

  return link.href;
}

function isExternalLink(link: NavLink) {
  return link.external === true;
}
