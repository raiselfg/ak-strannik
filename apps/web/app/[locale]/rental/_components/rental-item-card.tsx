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
      <ContentImage
        src={image}
        alt={imageAlt}
        emptyLabel={imageUnavailable}
        variant="rental"
      />
      {children ? (
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="leading-7 whitespace-pre-line text-muted-foreground">
            {children}
          </div>
        </div>
      ) : null}
    </ContentImageCard>
  );
}
