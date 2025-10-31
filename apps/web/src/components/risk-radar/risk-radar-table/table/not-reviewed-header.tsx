import type { FC } from 'react';

type NotReviewedHeaderProps = {
  checked: boolean;
  onChange: (reviewed: boolean) => void;
  onReview: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const NotReviewedHeader: FC<NotReviewedHeaderProps> = ({
  checked,
  onChange,
  onReview,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onReview}
        disabled={isLoading || disabled}
      >
        Review
      </button>
      {!disabled && (
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
          disabled={isLoading}
        />
      )}
    </div>
  );
};
