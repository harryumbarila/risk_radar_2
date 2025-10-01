import noUiSlider from 'nouislider';
import type { FC } from 'react';
import { useEffect } from 'react';

export const RangeSliderTwo: FC = () => {
  useEffect(() => {
    const sliderTwo = document.getElementById('rangeSliderTwo') as HTMLElement;

    noUiSlider.create(sliderTwo, {
      start: [20],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
       
      sliderTwo.noUiSlider.destroy();
    };
  }, []);

  return (
    <div className="rangeSliderCommon rangeSliderTwo">
      <div id="rangeSliderTwo" />
    </div>
  );
};
