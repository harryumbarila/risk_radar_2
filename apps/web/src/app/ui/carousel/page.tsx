import type { Metadata } from 'next';
import type { FC } from 'react';

import { Carousel } from '@/components/Carousels';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';

export const metadata: Metadata = {
  title: 'Next.js Carousel | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Carousel page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const CarouselPage: FC = () => {
  return (
    <DefaultLayout>
      <Carousel />
    </DefaultLayout>
  );
};

export default CarouselPage;
