import { useCallback, useEffect, useRef, useState } from 'react';

export const useDisableDelay = (delay = 1000) => {
  const [isLoading, setIsLoading] = useState(false);

  const isRunning = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const executeWithDelay = useCallback(
    async (func: () => void | Promise<void>) => {
      if (isRunning.current) {
        return;
      }

      isRunning.current = true;
      setIsLoading(true);

      try {
        await func();
      } finally {
        timeout.current = setTimeout(() => {
          isRunning.current = false;
          setIsLoading(false);
        }, delay);
      }
    },
    [delay],
  );

  return { executeWithDelay, isLoading };
};
