import { useQueryClient } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useFetchUser,
  useLogin,
  useRefreshAccessToken,
} from '@/hooks/api/useAuthApi';
import { api } from '@/services/http';
import { TUser } from '@/types/user';
import { storage } from '@/utils/storage';
import { LoginForm } from '@/validation/login.validation';

type ContextValues = {
  user: TUser | null;
  logout: (isDelete?: boolean) => void;
  login: (user: LoginForm) => Promise<void>;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext({} as ContextValues);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPromise = useRef<Promise<string | undefined> | null>(null);

  const { mutateAsync: loginService } = useLogin();
  const { mutateAsync: refreshService } = useRefreshAccessToken();
  const { mutateAsync: fetchUserService } = useFetchUser();

  const fetchUser = useCallback(async () => {
    const data = await fetchUserService();

    if (data) {
      setUser(data);
    }
  }, [fetchUserService]);

  const logout = useCallback(() => {
    setUser(null);
    storage.clearAll();
    queryClient.clear();
  }, [queryClient]);

  const login = useCallback(
    async (form: LoginForm) => {
      try {
        const data = await loginService(form);

        storage.set('accessToken', data.jwt);

        if (data.refreshToken) {
          storage.set('refreshToken', data.refreshToken);
        }

        await fetchUser();
      } catch (err) {
        logout();
        throw err;
      }
    },
    [loginService, fetchUser, logout],
  );

  const runRefresh = useCallback(async () => {
    const refreshToken = storage.getString('refreshToken');

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const data = await refreshService(refreshToken);

      storage.set('accessToken', data.jwt);
      await fetchUser();

      return data.jwt;
    } catch {
      logout();
    }
  }, [refreshService, fetchUser, logout]);

  const refreshAccessToken = useCallback(() => {
    if (!refreshPromise.current) {
      refreshPromise.current = runRefresh().finally(() => {
        refreshPromise.current = null;
      });
    }

    return refreshPromise.current;
  }, [runRefresh]);

  useEffect(() => {
    const getToken = async () => {
      await refreshAccessToken();
      setIsLoading(false);
    };

    void getToken();
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.message === 'Network Error') {
          return Promise.reject(new Error('Sem conexão com a internet!'));
        }

        if (
          error?.response?.status === 401 &&
          originalRequest.url !== 'auth/local/refresh' &&
          !originalRequest.retry
        ) {
          originalRequest.retry = true;

          const accessToken = await refreshAccessToken();

          if (!accessToken) {
            return Promise.reject(error);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }

        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        login,
        isLoading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
