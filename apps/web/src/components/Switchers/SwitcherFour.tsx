import type { FC } from "react";
import { useState } from "react";

export const SwitcherFour: FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
      <label
        htmlFor="toggle4"
        className="flex cursor-pointer select-none items-center"
        aria-label="Switcher"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle4"
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
          <div className="block h-8 w-14 rounded-full bg-black" />
          <div
            className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full"
            }`}
          />
        </div>
      </label>
    </div>
  );
};
