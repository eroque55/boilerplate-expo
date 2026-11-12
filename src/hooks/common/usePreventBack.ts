import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

import { useDefaultModal } from '@/store/defaultModalStore';

export const usePreventBack = (enabled?: boolean) => {
  const router = useRouter();
  const openModal = useDefaultModal(state => state.openModal);

  const handleBack = useCallback(() => {
    if (!enabled) {
      router.back();
      return;
    }

    openModal({
      title: 'Descartar?',
      message: 'Tem certeza que deseja descartar os dados inseridos?',
      confirmText: 'Descartar',
      cancelText: 'Cancelar',
      onConfirm: () => router.back(),
    });
  }, [enabled, router, openModal]);

  useEffect(() => {
    const backHandler = () => {
      handleBack();

      return true;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backHandler,
    );

    return () => {
      backHandlerSubscription.remove();
    };
  }, [handleBack]);

  return { handleBack };
};
