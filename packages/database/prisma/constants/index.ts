export const DEFAULT_LOCALE = 'ru';
export const PUBLISHED_AT = '2026-07-09T00:00:00.000Z';

export const LOCALES = [
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    pathPrefix: '',
    isDefault: true,
    isEnabled: true,
    sortOrder: 0,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    pathPrefix: 'en',
    isDefault: false,
    isEnabled: true,
    sortOrder: 1,
  },
] as const;

export const SITE_SETTINGS = {
  email: 'ak-strannik@mail.ru',
  phone: null,
  telegramUrl: null,
  vkUrl: 'https://vk.com/ak_strannik',
  youtubeUrl: 'https://www.youtube.com/@ustavoice',
  addressLatitude: '59.9278',
  addressLongitude: '30.3649',
  translations: {
    ru: {
      organizationName: 'Академия Странствий',
      legalName: 'Академия Странствий',
      addressText:
        'Санкт-Петербург, Невский проспект, дом 111/3; вход в арку с улицы Гончарной, дом 26',
      footerText: 'Культура в движении',
      defaultSeoTitle: 'Академия Странствий',
      defaultSeoDescription:
        'Творческое пространство в Санкт-Петербурге: события, фестивали, спектакли, мастер-классы и культурные проекты.',
    },
    en: {
      organizationName: 'Academy of Wanderings',
      legalName: 'Academy of Wanderings',
      addressText:
        'Saint Petersburg, Nevsky Prospect, 111/3; entrance through the arch from Goncharnaya Street, 26',
      footerText: 'Culture in motion',
      defaultSeoTitle: 'Academy of Wanderings',
      defaultSeoDescription:
        'A creative space in Saint Petersburg for events, festivals, performances, workshops and cultural projects.',
    },
  },
} as const;

export const LOCAL_MEDIA = [
  { key: 'logo', objectKey: '/logo.png', contentType: 'image/png', sizeBytes: 53371 },
  { key: 'ship', objectKey: '/ship.avif', contentType: 'image/avif', sizeBytes: 102532 },
  { key: 'svetlana', objectKey: '/svetlana.webp', contentType: 'image/webp', sizeBytes: 8818 },
  { key: 'aleksey', objectKey: '/aleksey.png', contentType: 'image/png', sizeBytes: 147991 },
  { key: 'ksenia', objectKey: '/ksenia.webp', contentType: 'image/webp', sizeBytes: 3228 },
  { key: 'roman', objectKey: '/roman.webp', contentType: 'image/webp', sizeBytes: 23398 },
  { key: 'tihon', objectKey: '/tihon.webp', contentType: 'image/webp', sizeBytes: 7178 },
  { key: 'blag-1', objectKey: '/blag-1.webp', contentType: 'image/webp', sizeBytes: 103778 },
  { key: 'blag-2', objectKey: '/blag-2.webp', contentType: 'image/webp', sizeBytes: 104588 },
  { key: 'blag-3', objectKey: '/blag-3.webp', contentType: 'image/webp', sizeBytes: 94040 },
  { key: 'blag-4', objectKey: '/blag-4.webp', contentType: 'image/webp', sizeBytes: 100014 },
  { key: 'blag-5', objectKey: '/blag-5.webp', contentType: 'image/webp', sizeBytes: 83940 },
  { key: 'blag-6', objectKey: '/blag-6.webp', contentType: 'image/webp', sizeBytes: 45646 },
] as const;

export const TEAM_MEMBERS = [
  {
    key: 'svetlana-isaeva',
    mediaKey: 'svetlana',
    sortOrder: 0,
    translations: {
      ru: {
        fullName: 'Светлана Исаева (УстА)',
        slug: 'svetlana-isaeva',
        roleTitle: 'Основатель академии',
        shortBio:
          'Певица, автор проекта «УстА» и основатель Академии Странствий.',
      },
      en: {
        fullName: 'Svetlana Isaeva (UstA)',
        slug: 'svetlana-isaeva',
        roleTitle: 'Academy founder',
        shortBio:
          'Singer, author of the UstA project and founder of the Academy of Wanderings.',
      },
    },
  },
  {
    key: 'aleksey-vinogradov',
    mediaKey: 'aleksey',
    sortOrder: 1,
    translations: {
      ru: {
        fullName: 'Алексей Виноградов',
        slug: 'aleksey-vinogradov',
        roleTitle: 'Технический директор',
      },
      en: {
        fullName: 'Alexey Vinogradov',
        slug: 'alexey-vinogradov',
        roleTitle: 'Technical director',
      },
    },
  },
  {
    key: 'ksenia-pronina',
    mediaKey: 'ksenia',
    sortOrder: 2,
    translations: {
      ru: {
        fullName: 'Ксения Пронина',
        slug: 'ksenia-pronina',
        roleTitle: 'Режиссер академии',
      },
      en: {
        fullName: 'Ksenia Pronina',
        slug: 'ksenia-pronina',
        roleTitle: 'Academy director',
      },
    },
  },
  {
    key: 'roman-goncharov',
    mediaKey: 'roman',
    sortOrder: 3,
    translations: {
      ru: {
        fullName: 'Роман Гончаров',
        slug: 'roman-goncharov',
        roleTitle: 'Артист, DJ',
      },
      en: {
        fullName: 'Roman Goncharov',
        slug: 'roman-goncharov',
        roleTitle: 'Artist, DJ',
      },
    },
  },
  {
    key: 'tihon-vinogradov',
    mediaKey: 'tihon',
    sortOrder: 4,
    translations: {
      ru: {
        fullName: 'Тихон Виноградов',
        slug: 'tihon-vinogradov',
        roleTitle: 'Пиар менеджер',
      },
      en: {
        fullName: 'Tikhon Vinogradov',
        slug: 'tikhon-vinogradov',
        roleTitle: 'PR manager',
      },
    },
  },
] as const;

export const PAGE_SEEDS = [
  {
    code: 'home',
    translations: {
      ru: {
        title: 'Академия Странствий',
        slug: '',
        seoTitle: 'Академия Странствий',
        seoDescription:
          'Создаём фестивали, спектакли, концерты и детские программы — события, где история, музыка и ремесло становятся живым приключением.',
      },
      en: {
        title: 'Academy of Wanderings',
        slug: '',
        seoTitle: 'Academy of Wanderings',
        seoDescription:
          'We create festivals, performances, concerts and children’s programs where history, music and craft become a living adventure.',
      },
    },
    blocks: [
      {
        type: 'hero',
        payload: {
          eyebrow: 'Санкт-Петербург · культура · путешествие',
          title: 'Академия Странствий',
          description:
            'Это корабль, путешествующий по вашим мечтам. Для вас у нас есть океан фантазии, бухта праздника, остров мастеров, реки спектаклей и материки фестивалей.',
          mediaKey: 'ship',
        },
      },
      {
        type: 'team',
        payload: {
          title: 'Команда Академии',
          quote:
            '«Странник — вольный ветер, ищущий свой путь в пересечениях тысячи дорог»',
          memberKeys: TEAM_MEMBERS.map((member) => member.key),
        },
      },
      {
        type: 'stats',
        payload: {
          title: 'Наши достижения',
          items: [
            { value: '40 000', label: 'Участников проектов Академии Странствий' },
            { value: '150 000', label: 'Охват аудитории на наших проектах' },
            { value: '10+', label: 'Благотворительных фондов, с которыми мы сотрудничаем' },
          ],
        },
      },
    ],
  },
  {
    code: 'about-events',
    translations: {
      ru: {
        title: 'Мероприятия',
        slug: 'about/events',
        seoTitle: 'Мероприятия Академии Странствий',
        seoDescription:
          'Афиша и прошедшие события Академии Странствий: фестивали, встречи, концерты и семейные программы.',
      },
      en: {
        title: 'Events',
        slug: 'about/events',
        seoTitle: 'Academy of Wanderings events',
        seoDescription:
          'Events by the Academy of Wanderings: festivals, meetings, concerts and family programs.',
      },
    },
    blocks: [
      {
        type: 'article',
        payload: {
          title: '2025 год',
          paragraphs: [
            'Зима позади, а теплые воспоминания остались!',
            '20 декабря Академия Странствий и СПб Камерный театр «ТОК» подарили детям настоящую новогоднюю сказку. Праздники для КДЦ Красногвардейский прошли с большим успехом сразу на двух площадках.',
            'В Готическом доме ребята из творческих коллективов и арт-причала «КВАнТ» погрузились в магию теневого театра на спектакле «Как заяц Мороз искал». На большой сцене КДК в Красном Селе мы показали веселый спектакль «Правила новогоднего настроения».',
            'Все зрители получили теплые поздравления от Деда Мороза, Снегурочки и веселой Лошадки, а каждый ребенок забрал домой подарок от главного волшебника.',
          ],
        },
      },
    ],
  },
  {
    code: 'about-partners',
    translations: {
      ru: {
        title: 'Партнеры',
        slug: 'about/partners',
        seoTitle: 'Партнеры Академии Странствий',
        seoDescription:
          'Партнеры, вместе с которыми Академия Странствий создает культурные проекты.',
      },
      en: {
        title: 'Partners',
        slug: 'about/partners',
        seoTitle: 'Academy of Wanderings partners',
        seoDescription:
          'Partners who help the Academy of Wanderings create cultural projects.',
      },
    },
    blocks: [
      {
        type: 'partner-feature',
        payload: {
          partnerKey: 'm-edison',
          title: 'Студия видеопродакшна М-Эдисон',
          description:
            'Более 10 лет на рынке. Проведение эфиров мероприятий, создание рекламных роликов, музыкальных клипов, репортажей, документальных фильмов и видеоблогов. Большая команда профессионалов готова выполнить работу любой сложности под ключ.',
        },
      },
    ],
  },
  {
    code: 'about-charity',
    translations: {
      ru: {
        title: 'Благотворительные проекты',
        slug: 'about/charity',
        seoTitle: 'Благотворительные проекты Академии Странствий',
        seoDescription:
          'Благотворительные концерты и социальные инициативы Академии Странствий.',
      },
      en: {
        title: 'Charity projects',
        slug: 'about/charity',
        seoTitle: 'Academy of Wanderings charity projects',
        seoDescription:
          'Charity concerts and social initiatives by the Academy of Wanderings.',
      },
    },
    blocks: [
      {
        type: 'article',
        payload: {
          title:
            'Благотворительные концерты в Домах престарелых и инвалидов Санкт-Петербурга и Ленинградской области',
          subtitle:
            '«Музыка, продлевающая жизнь - от сердца к сердцу» (2022-2026)',
          paragraphs: [
            'Академия Странствий совместно с проектом «СЧАСТЬЕ ЗДЕСЬ» провела серию благотворительных концертов «От сердца к сердцу» в домах престарелых.',
            'Залы наполнились живой музыкой, танцами и настоящей радостью. Вы подарили пожилым людям самое ценное — внимание и заботу.',
          ],
        },
      },
    ],
  },
  {
    code: 'about-thank-you-notes',
    translations: {
      ru: {
        title: 'Благодарственные письма',
        slug: 'about/thank-you-notes',
        seoTitle: 'Благодарственные письма',
        seoDescription:
          'Отзывы организаций, письма и подтверждения реализованных проектов Академии Странствий.',
      },
      en: {
        title: 'Letters of thanks',
        slug: 'about/thank-you-notes',
        seoTitle: 'Letters of thanks',
        seoDescription:
          'Organizational feedback and confirmations of completed Academy projects.',
      },
    },
    blocks: [
      {
        type: 'gallery',
        payload: {
          title: 'Благодарственные письма',
          mediaKeys: ['blag-1', 'blag-2', 'blag-3', 'blag-4', 'blag-5', 'blag-6'],
        },
      },
    ],
  },
] as const;

export const PARTNER_SEEDS = [
  {
    key: 'm-edison',
    websiteUrl: null,
    sortOrder: 0,
    translations: {
      ru: {
        name: 'Студия видеопродакшна М-Эдисон',
        description:
          'Проведение эфиров мероприятий, создание рекламных роликов, музыкальных клипов, репортажей, документальных фильмов и видеоблогов.',
      },
      en: {
        name: 'M-Edison video production studio',
        description:
          'Event broadcasts, commercials, music videos, reports, documentaries and video blogs.',
      },
    },
  },
] as const;

export const PROJECT_SEEDS = [
  {
    key: 'music-seven-notes',
    kind: 'festival',
    showcaseCategory: null,
    sortOrder: 0,
    translations: {
      ru: {
        title: 'Музыкальная программа «Музыка - 7 нот»',
        slug: 'projects/festival/music-seven-notes',
        excerpt: 'Музыкальная программа Академии Странствий.',
      },
      en: {
        title: 'Music program “Music - 7 Notes”',
        slug: 'projects/festival/music-seven-notes',
        excerpt: 'Music program by the Academy of Wanderings.',
      },
    },
  },
  {
    key: 'kindness-theater',
    kind: 'festival',
    showcaseCategory: null,
    sortOrder: 1,
    translations: {
      ru: {
        title: 'Фестиваль для детей и подростков «Театр-территория добра»',
        slug: 'projects/festival/kindness-theater',
        excerpt: 'Фестиваль для детей и подростков.',
      },
      en: {
        title: 'Festival for children and teenagers “Theater - Territory of Kindness”',
        slug: 'projects/festival/kindness-theater',
        excerpt: 'Festival for children and teenagers.',
      },
    },
  },
  {
    key: 'bravo',
    kind: 'festival',
    showcaseCategory: null,
    sortOrder: 2,
    translations: {
      ru: {
        title: 'Международный фестиваль искусств BRAVO',
        slug: 'projects/festival/bravo',
        excerpt: 'Международный фестиваль искусств.',
      },
      en: {
        title: 'International arts festival BRAVO',
        slug: 'projects/festival/bravo',
        excerpt: 'International arts festival.',
      },
    },
  },
  {
    key: 'letters-from-front',
    kind: 'showcase',
    showcaseCategory: 'concert',
    sortOrder: 10,
    translations: {
      ru: {
        title: 'Музыкально-литературная программа «Письма с фронта»',
        slug: 'projects/concerts/letters-from-front',
        excerpt:
          'Концертная программа, посвященная Дню Победы. В программе прозвучат любимые военные и послевоенные песни, строки из настоящих писем фронтовиков и хореографические постановки.',
      },
      en: {
        title: 'Music and literary program “Letters from the Front”',
        slug: 'projects/concerts/letters-from-front',
        excerpt:
          'A concert program dedicated to Victory Day with wartime songs, letters from the front and choreography.',
      },
    },
    blocks: [
      {
        type: 'cast',
        payload: {
          performers: [
            'Светлана Исаева',
            'Ансамбль «Калина»',
            'Театр танца «Северный сказ»',
            'Михаил Драгунов',
          ],
          durationMinutes: 60,
        },
      },
    ],
  },
  {
    key: 'northern-tale',
    kind: 'showcase',
    showcaseCategory: 'artist',
    sortOrder: 11,
    translations: {
      ru: {
        title: '«Северный Сказ»',
        slug: 'projects/artists/northern-tale',
        excerpt:
          'Творческий коллектив, собравший лучших танцовщиков и артистов Санкт-Петербурга. Коллектив был создан в 2010 году.',
      },
      en: {
        title: '“Northern Tale”',
        slug: 'projects/artists/northern-tale',
        excerpt:
          'A creative ensemble of dancers and artists from Saint Petersburg, founded in 2010.',
      },
    },
  },
  {
    key: 'marina',
    kind: 'showcase',
    showcaseCategory: 'performance',
    sortOrder: 12,
    translations: {
      ru: {
        title: 'Литературно-музыкальный спектакль «Марина»',
        slug: 'projects/performances/marina',
        excerpt:
          'Литературно-музыкальный спектакль по поэзии Марины Цветаевой.',
      },
      en: {
        title: 'Literary and musical performance “Marina”',
        slug: 'projects/performances/marina',
        excerpt:
          'A literary and musical performance based on Marina Tsvetaeva’s poetry.',
      },
    },
    blocks: [
      {
        type: 'cast',
        payload: {
          performers: ['Светлана Исаева', 'Мария Васильева', 'Андрей Гончаров'],
        },
      },
    ],
  },
  {
    key: 'vocal-masterclass',
    kind: 'showcase',
    showcaseCategory: 'master_class',
    sortOrder: 13,
    translations: {
      ru: {
        title: 'Мастер-класс по вокалу',
        slug: 'projects/masterclasses/vocal-masterclass',
        excerpt:
          'Ведет Лариса Александровна Тедтоева, заслуженная артистка Российской Федерации, народная артистка Республики Северная Осетия-Алания.',
      },
      en: {
        title: 'Vocal workshop',
        slug: 'projects/masterclasses/vocal-masterclass',
        excerpt:
          'Led by Larisa Tedtoeva, Honored Artist of the Russian Federation.',
      },
    },
  },
  {
    key: 'new-year-ust-izhora-2025',
    kind: 'showcase',
    showcaseCategory: 'holiday_event',
    sortOrder: 14,
    translations: {
      ru: {
        title: 'Новогодние представления для детей в Усть-Ижоре 2025 год',
        slug: 'projects/holiday-shows/new-year-ust-izhora-2025',
        excerpt:
          'Новогодние представления и интерактивные программы для детей.',
      },
      en: {
        title: 'New Year shows for children in Ust-Izhora 2025',
        slug: 'projects/holiday-shows/new-year-ust-izhora-2025',
        excerpt:
          'New Year performances and interactive programs for children.',
      },
    },
  },
  {
    key: 'russian-earth-inspiration',
    kind: 'showcase',
    showcaseCategory: 'exhibition',
    sortOrder: 15,
    translations: {
      ru: {
        title: 'Выставка «Вдохновение от Земли Русской»',
        slug: 'projects/exhibitions/russian-earth-inspiration',
        excerpt:
          'Выставка петербургских художников в рамках благотворительного фестиваля искусств «Вдохновение от Земли Русской».',
      },
      en: {
        title: 'Exhibition “Inspiration from the Russian Land”',
        slug: 'projects/exhibitions/russian-earth-inspiration',
        excerpt:
          'An exhibition of Saint Petersburg artists as part of a charity arts festival.',
      },
    },
  },
  {
    key: 'usta',
    kind: 'showcase',
    showcaseCategory: 'artist',
    sortOrder: 16,
    translations: {
      ru: {
        title: 'Певица «УстА»',
        slug: 'projects/usta',
        excerpt:
          'В музыке «УстА» соединяются русский фольклор, современное звучание, поэтика и современные биты. Проект родился в 2015 году.',
      },
      en: {
        title: 'Singer “UstA”',
        slug: 'projects/usta',
        excerpt:
          'UstA blends Russian folklore, modern sound, poetry and contemporary beats.',
      },
    },
    blocks: [
      {
        type: 'video-grid',
        payload: {
          videos: [
            { title: 'Земелюшка', provider: 'youtube' },
            { title: 'Уста', provider: 'youtube' },
            { title: 'Концерт в Мюзик Холле', provider: 'youtube' },
            { title: 'Устиния «Гори ясно»', provider: 'youtube' },
            { title: 'Прялочка', provider: 'youtube' },
            { title: 'Устиния «Птица»', provider: 'youtube' },
          ],
        },
      },
    ],
  },
  {
    key: 'pryalochka-of-time',
    kind: 'showcase',
    showcaseCategory: 'performance',
    sortOrder: 17,
    translations: {
      ru: {
        title: 'Музыкальный сказ «Прялочка времени»',
        slug: 'projects/pryalochka-of-time',
        excerpt:
          'Петербургский камерный Театр «ТОК» и певица UstA создали музыкальный сказ, наполненный старинными народными обрядами и заговорами.',
      },
      en: {
        title: 'Musical tale “Pryalochka of Time”',
        slug: 'projects/pryalochka-of-time',
        excerpt:
          'A musical tale by Saint Petersburg chamber theater TOK and singer UstA.',
      },
    },
  },
  {
    key: 'heart-to-heart',
    kind: 'charity',
    showcaseCategory: null,
    sortOrder: 30,
    translations: {
      ru: {
        title: 'Музыка, продлевающая жизнь - от сердца к сердцу',
        slug: 'about/charity/heart-to-heart',
        excerpt:
          'Благотворительные концерты в домах престарелых и инвалидов Санкт-Петербурга и Ленинградской области.',
      },
      en: {
        title: 'Music that prolongs life - from heart to heart',
        slug: 'about/charity/heart-to-heart',
        excerpt:
          'Charity concerts in nursing homes in Saint Petersburg and the Leningrad region.',
      },
    },
  },
] as const;

export const EVENT_SEEDS = [
  {
    key: 'new-year-2025',
    startsAt: '2025-12-20T12:00:00.000+03:00',
    timezone: 'Europe/Moscow',
    sortOrder: 0,
    translations: {
      ru: {
        title: 'Новогодняя сказка Академии Странствий и СПб Камерного театра «ТОК»',
        slug: 'about/events/new-year-2025',
        excerpt:
          'Праздники для КДЦ Красногвардейский прошли с большим успехом сразу на двух площадках.',
      },
      en: {
        title: 'New Year tale by the Academy of Wanderings and TOK chamber theater',
        slug: 'about/events/new-year-2025',
        excerpt:
          'Holiday events for children took place successfully at two venues.',
      },
    },
  },
  {
    key: 'road-safety-strelna',
    startsAt: '2026-03-01T12:00:00.000+03:00',
    timezone: 'Europe/Moscow',
    sortOrder: 1,
    translations: {
      ru: {
        title: 'Профилактика ПДД: вместе к здоровому будущему',
        slug: 'about/events/road-safety-strelna',
        excerpt:
          'Академия Странствий и театральная мастерская «Чудопраздник» провели мероприятие в поселке Стрельна.',
      },
      en: {
        title: 'Road safety prevention: together toward a healthy future',
        slug: 'about/events/road-safety-strelna',
        excerpt:
          'The Academy of Wanderings and Chudoprazdnik theater workshop held an event in Strelna.',
      },
    },
  },
] as const;

export const RENTAL_SEEDS = [
  {
    key: 'prop-snow-globe',
    category: 'prop',
    sortOrder: 0,
    translations: {
      ru: { title: 'Надувной шар', slug: 'rent/requisite/snow-globe', excerpt: 'Аренда реквизита для событий.' },
      en: { title: 'Inflatable globe', slug: 'rent/requisite/snow-globe', excerpt: 'Prop rental for events.' },
    },
  },
  {
    key: 'prop-light-table',
    category: 'prop',
    sortOrder: 1,
    translations: {
      ru: { title: 'Световой стол-планшет для рисования песком', slug: 'rent/requisite/light-sand-table', excerpt: 'Интерактивный реквизит для мастер-классов.' },
      en: { title: 'Light table for sand drawing', slug: 'rent/requisite/light-sand-table', excerpt: 'Interactive prop for workshops.' },
    },
  },
  {
    key: 'attraction-tug-of-war',
    category: 'attraction',
    sortOrder: 10,
    translations: {
      ru: { title: 'Перетягивание каната', slug: 'rent/attraction/tug-of-war', excerpt: 'Активный аттракцион для выездных праздников.' },
      en: { title: 'Tug of war', slug: 'rent/attraction/tug-of-war', excerpt: 'Active attraction for outdoor events.' },
    },
  },
  {
    key: 'attraction-log-pillow-fight',
    category: 'attraction',
    sortOrder: 11,
    translations: {
      ru: { title: 'Бои на бревне подушками', slug: 'rent/attraction/log-pillow-fight', excerpt: 'Веселый интерактивный аттракцион.' },
      en: { title: 'Pillow fight on a log', slug: 'rent/attraction/log-pillow-fight', excerpt: 'Fun interactive attraction.' },
    },
  },
  {
    key: 'attraction-barrel-build',
    category: 'attraction',
    sortOrder: 12,
    translations: {
      ru: { title: 'Собери бочку из частей на время', slug: 'rent/attraction/barrel-build', excerpt: 'Командная игра на скорость.' },
      en: { title: 'Assemble a barrel against the clock', slug: 'rent/attraction/barrel-build', excerpt: 'Team speed game.' },
    },
  },
  {
    key: 'mascot-bear',
    category: 'mascot',
    sortOrder: 20,
    translations: {
      ru: { title: 'Медведь', slug: 'rent/mascot-costume/bear', excerpt: 'Ростовая кукла для веселого праздника.' },
      en: { title: 'Bear', slug: 'rent/mascot-costume/bear', excerpt: 'Mascot costume for celebrations.' },
    },
  },
  {
    key: 'mascot-cheburashka',
    category: 'mascot',
    sortOrder: 21,
    translations: {
      ru: { title: 'Чебурашка', slug: 'rent/mascot-costume/cheburashka', excerpt: 'Ростовая кукла для детских событий.' },
      en: { title: 'Cheburashka', slug: 'rent/mascot-costume/cheburashka', excerpt: 'Mascot costume for children’s events.' },
    },
  },
  {
    key: 'mascot-fox',
    category: 'mascot',
    sortOrder: 22,
    translations: {
      ru: { title: 'Лисичка', slug: 'rent/mascot-costume/fox', excerpt: 'Ростовая кукла для праздников и промо-событий.' },
      en: { title: 'Fox', slug: 'rent/mascot-costume/fox', excerpt: 'Mascot costume for celebrations and promo events.' },
    },
  },
] as const;

export const REDIRECT_SEEDS = [
  { fromPath: '/event', toPath: '/about/events' },
  { fromPath: '/partners', toPath: '/about/partners' },
  { fromPath: '/charity', toPath: '/about/charity' },
  { fromPath: '/festivals', toPath: '/projects/festival' },
  { fromPath: '/concert', toPath: '/projects/concerts' },
  { fromPath: '/artstisty', toPath: '/projects/artists' },
  { fromPath: '/performances', toPath: '/projects/performances' },
  { fromPath: '/masterclasses', toPath: '/projects/masterclasses' },
  { fromPath: '/newyear', toPath: '/projects/holiday-shows' },
  { fromPath: '/exhibitions', toPath: '/projects/exhibitions' },
  { fromPath: '/usta', toPath: '/projects/usta' },
  { fromPath: '/attractions', toPath: '/rent/attraction' },
  { fromPath: '/costumes', toPath: '/rent/mascot-costume' },
] as const;
