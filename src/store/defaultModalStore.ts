import { create } from 'zustand';

export type DefaultModalProps = {
  title: string;
  message: string;
  confirmText: string;
  notice?: string;
  onConfirm?: () => Promise<void> | void;
  cancelText?: string;
  onCancel?: () => Promise<void> | void;
  successMessage?: string;
};

type Store = {
  modal: DefaultModalProps | null;
  openModal: (props: DefaultModalProps) => void;
  closeModal: () => void;
};

export const useDefaultModal = create<Store>(set => ({
  modal: null,
  openModal: props => set({ modal: props }),
  closeModal: () => set({ modal: null }),
}));
