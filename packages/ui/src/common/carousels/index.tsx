'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { CarouselOne } from '@/ui/common/carousels/carousel-one';
import { CarouselThree } from '@/ui/common/carousels/carousel-three';
import { CarouselTwo } from '@/ui/common/carousels/carousel-two';

export const Carousel: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Carousel" />

      <div className="flex flex-col gap-7.5">
        <CarouselOne />
        <CarouselTwo />
        <CarouselThree />
      </div>
    </>
  );
};
