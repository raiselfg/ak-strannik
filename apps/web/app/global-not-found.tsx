import type { Metadata } from 'next';

import { NotFoundScene } from '@/app/_components/page/not-found-scene';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body>
        <NotFoundScene
          title="Страница затерялась в пути"
          description="Похоже, такой страницы больше нет или адрес изменился. Вернитесь на главную — там легко найти нужный маршрут."
          eyebrow="Ошибка 404 · Курс потерян"
          homeLabel="Вернуться на главную"
          contactLabel="Связаться с нами"
          homeHref="/"
        />
      </body>
    </html>
  );
}
