import React from 'react';

import { GenerationFormMode } from '@/types/attribution-url';

type GenerationModeSelectorProps = {
  generationMode: GenerationFormMode;
  onModeChange: (mode: GenerationFormMode) => void;
};

export const GenerationModeSelector: React.FC<GenerationModeSelectorProps> = ({
  generationMode,
  onModeChange,
}) => {
  return (
    <div className="mb-4.5">
      <label
        htmlFor="generation-mode"
        className="mb-2.5 block text-black dark:text-white"
      >
        Link Generation Mode
      </label>
      <div className="flex gap-4" id="generation-mode">
        <label className="flex items-center">
          <input
            type="radio"
            value={GenerationFormMode.EXISTING_LEAD}
            checked={generationMode === GenerationFormMode.EXISTING_LEAD}
            onChange={() => onModeChange(GenerationFormMode.EXISTING_LEAD)}
            className="mr-2"
          />
          Generate link for existing lead
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value={GenerationFormMode.NEW_LEAD}
            checked={generationMode === GenerationFormMode.NEW_LEAD}
            onChange={() => onModeChange(GenerationFormMode.NEW_LEAD)}
            className="mr-2"
          />
          Generate link for any new lead
        </label>
      </div>
    </div>
  );
};
