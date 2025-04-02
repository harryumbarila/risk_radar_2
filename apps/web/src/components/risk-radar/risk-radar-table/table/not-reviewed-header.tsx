import type { FC } from 'react';

type NotReviewedHeaderProps = {
  handleClickOnReviewButton: () => void;
};

export const NotReviewedHeader: FC<NotReviewedHeaderProps> = ({
  handleClickOnReviewButton,
}) => {
  return (
    <div>
      <button
        className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
        type="button"
        onClick={handleClickOnReviewButton}
      >
        Review
      </button>
    </div>
  );
};
