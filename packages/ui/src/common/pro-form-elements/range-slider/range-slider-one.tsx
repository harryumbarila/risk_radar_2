import noUiSlider from 'nouislider';
import type { FC } from 'react';
import { useEffect } from 'react';

export const RangeSliderOne: FC = () => {
  useEffect(() => {
    const sliderOne = document.getElementById('rangeSliderOne') as HTMLElement;

    noUiSlider.create(sliderOne, {
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
       
      sliderOne.noUiSlider.destroy();
    };
  }, []);

  return (
    <div className="rangeSliderCommon rangeSliderOne">
      <div id="rangeSliderOne" />
    </div>
  );
};
