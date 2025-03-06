import { useEffect } from 'react';

import { useLocalStorage } from './use-local-storage';

type UseColorReturnType = [string, (value: string) => void];

export const useColorMode = (): UseColorReturnType => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass =
      typeof window !== 'undefined' ? window.document.body.classList : null;

    if (colorMode === 'dark') {
      bodyClass?.add(className);
    } else {
      bodyClass?.remove(className);
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};
