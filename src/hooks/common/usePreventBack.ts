import { usePreventRemove, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { useDefaultModal } from '@/store/defaultModalStore';

export const usePreventBack = (enabled = false) => {
  const router = useRouter();
  const openModal = useDefaultModal(state => state.openModal);
  const [isDismissing, setIsDismissing] = useState(false);

  const shouldPrevent = enabled && !isDismissing;

  usePreventRemove(shouldPrevent, ({ repeat }) => {
    openModal({
      title: 'Descartar?',
      message: 'Tem certeza que deseja descartar os dados inseridos?',
      confirmText: 'Descartar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setIsDismissing(true);
        repeat();
      },
    });
  });

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  return { handleBack };
};
