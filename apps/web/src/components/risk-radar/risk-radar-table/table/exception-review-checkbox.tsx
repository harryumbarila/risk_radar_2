import type { FC } from 'react';

type Props = {
  reviewed: boolean;
  exceptionId: number;
  onChange: (exceptionId: number) => void;
};

export const ExceptionReviewCheckbox: FC<Props> = ({
  reviewed,
  exceptionId,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={reviewed}
        onChange={() => onChange(exceptionId)}
      />
    </div>
  );
};
