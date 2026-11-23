import { useQueryClient } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useLogin, useLogout } from '@/hooks/api/useAuthApi';
import { useFetchMe } from '@/hooks/api/useUsersApi';
import { onSessionExpired } from '@/services/http';
import { TUser } from '@/types/user';
import { session } from '@/utils/session';
import { LoginForm } from '@/validation/login.validation';

type ContextValues = {
  user: TUser | null;
  logout: () => Promise<void>;
  login: (form: LoginForm) => Promise<void>;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext({} as ContextValues);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync: loginService } = useLogin();
  const { mutateAsync: logoutService } = useLogout();
  const { mutateAsync: fetchMeService } = useFetchMe();

  const endSession = useCallback(() => {
    session.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const fetchUser = useCallback(async () => {
    setUser(await fetchMeService());
  }, [fetchMeService]);

  const logout = useCallback(async () => {
    const refreshToken = session.getRefreshToken();

    if (refreshToken) {
      await logoutService(refreshToken).catch(() => undefined);
    }

    endSession();
  }, [logoutService, endSession]);

  const login = useCallback(
    async (form: LoginForm) => {
      const { user: loggedUser, ...tokens } = await loginService(form);

      session.start(tokens, form.requestRefresh);
      setUser(loggedUser);
    },
    [loginService],
  );

  useEffect(() => onSessionExpired(endSession), [endSession]);

  useEffect(() => {
    const restoreSession = async () => {
      if (session.hasSession()) {
        await fetchUser().catch(() => undefined);
      }

      setIsLoading(false);
    };

    void restoreSession();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

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
