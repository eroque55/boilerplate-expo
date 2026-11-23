import { useMutation } from '@tanstack/react-query';

import { usersService } from '@/services/api/users';

export const useFetchMe = () => {
  return useMutation({
    mutationFn: usersService.fetchMe,
    meta: { suppressErrorModal: true },
  });
};
