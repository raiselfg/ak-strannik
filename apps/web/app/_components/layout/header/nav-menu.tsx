'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@ak-strannik/ui/components/navigation-menu';
import { cn } from '@ak-strannik/ui/lib/utils';
import { usePathname } from '@/i18n/navigation';

import { contactNavLink, homeNavLink, navGroups } from './constants/constants';
import {
  DesktopNavLink,
  isExternalLink,
  isLinkActive,
  MobileNavLink,
} from './navigation-link';

interface NavMenuProps {
  className?: string;
}

interface MobileNavigationListProps {
  className?: string;
  onItemClick?: () => void;
}

export function NavMenu({ className }: NavMenuProps) {
  const pathname = usePathname();
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
            active={isLinkActive(pathname, homeNavLink)}
            className={navigationMenuTriggerStyle()}
          />
        </NavigationMenuItem>

        {navGroups.map((item) => (
          <NavigationMenuItem key={item.labelKey}>
            <NavigationMenuTrigger
              className={cn(
                item.links.some((link) => isLinkActive(pathname, link)) &&
                  'bg-gold/15 text-gold'
              )}
            >
              {t(item.labelKey)}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-72 p-2">
              <ul className="grid gap-1">
                {item.links.map((link) => {
                  const label = t(link.labelKey);

                  return (
                    <li key={link.labelKey}>
                      <DesktopNavLink
                        link={link}
                        label={label}
                        active={isLinkActive(pathname, link)}
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
            active={false}
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
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mobileAriaLabel')}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="grid gap-1">
        <MobileNavLink
          link={homeNavLink}
          label={t(homeNavLink.labelKey)}
          active={isLinkActive(pathname, homeNavLink)}
          onClick={onItemClick}
        />
        <MobileNavLink
          link={contactNavLink}
          label={t(contactNavLink.labelKey)}
          active={false}
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
                  active={isLinkActive(pathname, link)}
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
