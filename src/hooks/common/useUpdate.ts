import * as Updates from 'expo-updates';
import { useCallback, useEffect, useState } from 'react';

export const useUpdate = () => {
  const [needsCheck, setNeedsCheck] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isFirstCheck, setIsFirstCheck] = useState(__DEV__ ? false : true);

  const update = useCallback(async () => {
    try {
      await Updates.fetchUpdateAsync();

      if (isFirstCheck) {
        await Updates.reloadAsync();
        return;
      }
    } catch {
      //
    }
  }, [isFirstCheck]);

  const checkForUpdates = useCallback(async () => {
    if (hasUpdate) {
      return;
    }

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      setHasUpdate(isAvailable);

      if (isAvailable) {
        await update();
      }

      setNeedsCheck(false);
      setIsFirstCheck(false);
    } catch {
      setHasUpdate(false);
      setNeedsCheck(false);
      setIsFirstCheck(false);
    }
  }, [hasUpdate, update]);

  useEffect(() => {
    if (needsCheck) {
      void checkForUpdates();
    }

    const timer = setTimeout(
      () => {
        setNeedsCheck(true);
      },
      1 * 60 * 1000,
    );

    return () => clearTimeout(timer);
  }, [needsCheck, checkForUpdates]);

  return { isFirstCheck, hasUpdate };
};
