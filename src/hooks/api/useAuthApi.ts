import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/api/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

export const useRefreshAccessToken = () => {
  return useMutation({
    mutationFn: authService.refreshAccessToken,
  });
};

export const useFetchUser = () => {
  return useMutation({
    mutationFn: authService.fetchUser,
  });
};
