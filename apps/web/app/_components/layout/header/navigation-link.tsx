'use client';

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

import { NavigationMenuLink } from '@ak-strannik/ui/components/navigation-menu';
import { cn } from '@ak-strannik/ui/lib/utils';
import { Link } from '@/i18n/navigation';

import type { NavLink } from './constants/constants';

type HeaderLinkProps = {
  link: NavLink;
  label: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  ariaCurrent?: 'page';
};

type DesktopNavLinkProps = HeaderLinkProps & {
  active: boolean;
};

export function DesktopNavLink({
  link,
  label,
  active,
  className,
  children = label,
}: DesktopNavLinkProps) {
  if (isExternalLink(link)) {
    return (
      <NavigationMenuLink asChild>
        <a
          href={link.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </NavigationMenuLink>
    );
  }

  return (
    <NavigationMenuLink asChild active={active}>
      <Link
        href={link.href}
        className={cn(className, active && 'text-gold')}
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

export function MobileNavLink({
  link,
  label,
  onClick,
  active = false,
}: HeaderLinkProps & { active?: boolean }) {
  return (
    <HeaderLink
      link={link}
      label={label}
      onClick={onClick}
      className={cn(
        'flex min-h-11 items-center justify-between rounded-2xl px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
        active && 'bg-gold/15 text-gold'
      )}
      ariaCurrent={active ? 'page' : undefined}
    >
      <span>{label}</span>
      {isExternalLink(link) ? (
        <ExternalLink
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      ) : null}
    </HeaderLink>
  );
}

function HeaderLink({
  link,
  label,
  className,
  onClick,
  children = label,
  ariaCurrent,
}: HeaderLinkProps) {
  if (isExternalLink(link)) {
    return (
      <a
        href={link.href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className={className}
      onClick={onClick}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  );
}

export function isExternalLink(link: NavLink) {
  return link.external === true;
}

export function isLinkActive(pathname: string, link: NavLink) {
  if (link.external || link.href.includes('#')) return false;
  if (link.href === '/') return pathname === '/';
  if (link.href === '/projects/festival') {
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }
  return pathname === link.href;
}
