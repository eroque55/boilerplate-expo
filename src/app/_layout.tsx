import '@/theme/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DefaultModal } from '@/components/ui';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useDimensions, useTheme, useUpdate } from '@/hooks/common';
import { queryClient } from '@/services/queryClient';
import { colors } from '@/theme/colors';

export { ErrorBoundary } from '@/components/layout';

setDefaultOptions({ locale: ptBR });

void SplashScreen.preventAutoHideAsync();

const ProtectedStack = () => {
  const { user } = useAuth();
  const { insets } = useDimensions();
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark
            ? colors.neutral[900]
            : colors.lightBackground,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
    </Stack>
  );
};

const RootLayout = () => {
  const { isFirstCheck } = useUpdate();
  const [fontsLoaded] = useFonts({});

  const isAppReady = !isFirstCheck && fontsLoaded;

  if (!isAppReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <AuthProvider>
              <StatusBar style="auto" />

              <ProtectedStack />

              <DefaultModal />
            </AuthProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
