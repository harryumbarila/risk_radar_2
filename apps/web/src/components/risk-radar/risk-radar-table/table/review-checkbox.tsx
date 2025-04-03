import type { FC } from 'react';

type Props = {
  exceptionId: string;
  onChange: (exceptionId: string) => void;
};

export const ExceptionReviewCheckbox: FC<Props> = ({
  exceptionId,
  onChange,
}) => {
  return (
    <input
      type="checkbox"
      checked={!!exceptionId}
      onChange={() => onChange(exceptionId)}
    />
  );
};
