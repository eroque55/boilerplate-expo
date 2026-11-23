import { TUser } from '@/types/user';

import { api } from '../http';

const BASE_URL = 'users';

export const usersService = {
  fetchMe: async () => {
    const { data } = await api.get<TUser>(`${BASE_URL}/me`);
    return data;
  },
};
