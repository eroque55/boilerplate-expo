/* eslint-disable require-await */
import { TLoginResponse, TUser } from '@/types/user';
import { LoginForm } from '@/validation/login.validation';

// import { api } from '../http';

// const BASE_URL = '/auth';

export const authService = {
  login: async (form: LoginForm) => {
    // const { data } = await api.post<TLoginResponse>(`${BASE_URL}/local`, form);
    // return data;

    const data: TLoginResponse = {
      jwt: 'mocked-jwt-token',
      refreshToken: 'mocked-refresh-token',
      user: {
        id: 0,
        documentId: 'Mocked Document ID',
        email: form.email,
      },
    };
    return data;
  },

  refreshAccessToken: async (_refreshToken: string) => {
    // const { data } = await api.post<TLoginResponse>(
    //   `${BASE_URL}/refresh-token`,
    //   {
    //     refreshToken,
    //   },
    // );
    // return data;

    const data: TLoginResponse = {
      jwt: 'mocked-jwt-token',
      refreshToken: 'mocked-refresh-token',
      user: {
        id: 0,
        documentId: 'Mocked Document ID',
        email: 'mocked-email@example.com',
      },
    };

    return data;
  },

  fetchUser: async () => {
    // const { data } = await api.get<TUser>(`${BASE_URL}/me`);
    // return data;

    const data: TUser = {
      id: 0,
      documentId: 'Mocked Document ID',
      name: 'Mocked User',
    };

    return data;
  },
};
