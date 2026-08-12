export const contacts = {
  phone: { display: '+7 (905) 205-25-50', href: 'tel:+79052052550' },
  email: { display: 'ak-strannik@mail.ru', href: 'mailto:ak-strannik@mail.ru' },
  address: 'Санкт-Петербург, Невский проспект, дом 111/3',
  addressNote: 'вход в арку с улицы Гончарной, дом 26',
  socials: {
    vk: 'https://vk.com/fondas',
    youtube: 'https://www.youtube.com/@aka_stran/featured',
  },
  mapEmbed: '' as string,
};
export const MAP_CENTER: [number, number] = [59.928686, 30.370513];
export const YANDEX_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';
