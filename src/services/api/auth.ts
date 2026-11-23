import { TAuthSession, TRegisterInput } from '@/types/auth';
import { LoginForm } from '@/validation/login.validation';

import { api } from '../http';

const BASE_URL = 'auth';

export const authService = {
  register: async (input: TRegisterInput) => {
    const { data } = await api.post<TAuthSession>(
      `${BASE_URL}/register`,
      input,
    );
    return data;
  },

  login: async ({ email, password }: LoginForm) => {
    const { data } = await api.post<TAuthSession>(`${BASE_URL}/login`, {
      email,
      password,
    });
    return data;
  },

  logout: async (refreshToken: string) => {
    await api.post(`${BASE_URL}/logout`, { refreshToken });
  },

  logoutAll: async () => {
    await api.post(`${BASE_URL}/logout-all`);
  },
};
