import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/api/auth';

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    meta: { suppressErrorModal: true },
  });
};

export const useLogoutAll = () => {
  return useMutation({
    mutationFn: authService.logoutAll,
  });
};
