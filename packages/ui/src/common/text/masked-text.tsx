import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

type MaskedTextProps = {
  text: string;
  maskChar?: string;
  initiallyVisible?: boolean;
  className?: string;
};

export const MaskedText: React.FC<MaskedTextProps> = ({
  text,
  maskChar = '*',
  initiallyVisible = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  const toggleVisibility = (): void => setIsVisible((prev) => !prev);

  const displayText = isVisible ? text : maskChar.repeat(text.length);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-800">
        {displayText}
      </span>

      <button
        type="button"
        onClick={toggleVisibility}
        className="text-blue-600 hover:text-blue-800 transition"
        aria-label={isVisible ? 'Mask text' : 'Reveal text'}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
