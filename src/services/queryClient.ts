import { MutationCache, QueryClient } from '@tanstack/react-query';

import { useDefaultModal } from '@/store/defaultModalStore';
import { handleError } from '@/utils/handleError';
import { triggerHaptic } from '@/utils/haptics';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
      retry: false,
      initialDataUpdatedAt: 0,
    },
    mutations: {
      onError: error => {
        triggerHaptic('error');

        useDefaultModal.getState().openModal({
          title: 'Ops!',
          message: handleError(error),
          confirmText: 'Fechar',
        });
      },
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQueries) {
        void queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidateQueries,
        });
      }
    },
  }),
});
