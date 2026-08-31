import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react-native';
import { PropsWithChildren, ReactElement } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Metrics, SafeAreaProvider } from 'react-native-safe-area-context';

const TEST_METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

export const createWrapper = (queryClient = createTestQueryClient()) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <KeyboardProvider>{children}</KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );

  return Wrapper;
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderOptions,
) => render(ui, { wrapper: createWrapper(), ...options });

export * from '@testing-library/react-native';
export { renderWithProviders as render };
