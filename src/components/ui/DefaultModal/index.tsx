import { Text, View } from 'react-native';

import { useDefaultModal } from '@/store/defaultModalStore';

import ModalBackdrop from '../ModalBackdrop';

import DefaultModalButton from './DefaultModalButton';

const DefaultModal = () => {
  const { modal, closeModal, openModal } = useDefaultModal();

  if (!modal) {
    return null;
  }

  const handleConfirm = async () => {
    if (modal.onConfirm) {
      await modal.onConfirm();
    }

    closeModal();

    if (modal.successMessage) {
      openModal({
        title: 'Sucesso!',
        message: modal.successMessage,
        confirmText: 'Voltar',
      });
    }
  };

  const handleCancel = async () => {
    if (modal.onCancel) {
      await modal.onCancel();
    }
    closeModal();
  };

  return (
    <ModalBackdrop>
      <View
        key={modal.message}
        className="w-full overflow-hidden rounded-lg bg-white dark:bg-neutral-800"
      >
        <View className="bg-neutral-100 p-3 dark:bg-neutral-700">
          <Text className="text-lg text-neutral-600 dark:text-neutral-200">
            {modal.title}
          </Text>
        </View>

        <View className="min-h-28 gap-2 border-t border-b border-neutral-200 p-3 dark:border-neutral-600">
          <Text className="text-base text-neutral-600 dark:text-neutral-300">
            {modal.message}
          </Text>

          {modal.notice && (
            <Text className="text-sm text-neutral-400">{modal.notice}</Text>
          )}
        </View>

        <View className="flex-row">
          {modal.cancelText && (
            <DefaultModalButton
              showBorder
              text={modal.cancelText}
              onPress={handleCancel}
            />
          )}

          <DefaultModalButton
            text={modal.confirmText}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </ModalBackdrop>
  );
};

export default DefaultModal;
