export type NavLink = {
  labelKey: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  labelKey: string;
  links: readonly NavLink[];
};

export const homeNavLink = {
  labelKey: 'home',
  href: '/',
} as const satisfies NavLink;

export const contactNavLink = {
  labelKey: 'contacts',
  href: '/#contacts',
} as const satisfies NavLink;

export const navGroups = [
  {
    labelKey: 'groups.about',
    links: [
      { labelKey: 'links.events', href: '/about/events' },
      { labelKey: 'links.partners', href: '/about/partners' },
      { labelKey: 'links.charity', href: '/about/charity' },
      { labelKey: 'links.thankYouNotes', href: '/about/thank-you-notes' },
    ],
  },
  {
    labelKey: 'groups.projects',
    links: [
      { labelKey: 'links.festival', href: '/projects/festival' },
      { labelKey: 'links.concerts', href: '/projects/concerts' },
      { labelKey: 'links.artists', href: '/projects/artists' },
      { labelKey: 'links.performances', href: '/projects/performances' },
      {
        labelKey: 'links.masterclasses',
        href: '/projects/masterclasses',
      },
      { labelKey: 'links.holidayShows', href: '/projects/holiday-shows' },
      { labelKey: 'links.exhibitions', href: '/projects/exhibitions' },
      { labelKey: 'links.usta', href: '/projects/usta' },
      {
        labelKey: 'links.ustaBoutique',
        href: 'https://us-ta.ru',
        external: true,
      },
      {
        labelKey: 'links.pryalochkaOfTime',
        href: '/projects/pryalochka-of-time',
      },
    ],
  },
  {
    labelKey: 'groups.rent',
    links: [
      { labelKey: 'links.requisite', href: '/rent/requisite' },
      { labelKey: 'links.attraction', href: '/rent/attraction' },
      { labelKey: 'links.mascotCostume', href: '/rent/mascot-costume' },
    ],
  },
] as const satisfies readonly NavGroup[];
