import type { ReactNode } from 'react';

import { ContentImage } from '@/app/_components/content/content-image-gallery';
import { ContentImageCard } from '@/app/_components/content/content-page';

export function RentalItemCard({
  image,
  imageAlt,
  imageUnavailable,
  children,
}: {
  image: string;
  imageAlt: string;
  imageUnavailable: string;
  children?: ReactNode;
}) {
  return (
    <ContentImageCard>
      <ContentImage src={image} alt={imageAlt} emptyLabel={imageUnavailable} />
      <div className="px-4 pt-6 pb-5">
        {children ? (
          <div className="mt-3 leading-7 whitespace-pre-line text-muted-foreground">
            {children}
          </div>
        ) : null}
      </div>
    </ContentImageCard>
  );
}
