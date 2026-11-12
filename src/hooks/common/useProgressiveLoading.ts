import { useEffect, useRef, useState } from 'react';

export const useProgressiveLoading = (delays: number[]) => {
  const delaysRef = useRef(delays);

  const [loadedComponents, setLoadedComponents] = useState<boolean[]>(() =>
    new Array(delays.length).fill(false),
  );

  useEffect(() => {
    const timers = delaysRef.current.map((delay, index) =>
      setTimeout(() => {
        setLoadedComponents(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay),
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return loadedComponents;
};
