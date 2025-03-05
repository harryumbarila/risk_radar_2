'use client';

import { AccordionOne } from '@/ui/common/accordions/accordion-one';
import { AccordionTwo } from '@/ui/common/accordions/accordion-two';
import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';

export const Accordion: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Accordion" />

      <div className="flex flex-col gap-7.5">
        <AccordionOne />
        <AccordionTwo />
      </div>
    </>
  );
};
