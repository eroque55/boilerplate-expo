# Testing

Read this before writing or fixing a test.

## Setup

- **Jest** with the `jest-expo` preset
- **@testing-library/react-native v14** — see the async warning below
- Tests live **next to the code**: `validators.ts` → `validators.test.ts`,
  `Button/index.tsx` → `Button/index.test.tsx`

```bash
yarn test            # once
yarn test:watch      # watch
yarn test:coverage   # report at coverage/lcov-report/index.html
```

## Testing Library v14 is async

`render`, `renderHook`, `fireEvent.*`, `unmount` and `rerender` all return a
Promise and **must be awaited**. Almost every example online shows the old
synchronous API and will not work here.

```tsx
const { result } = await renderHook(() => useThing());
await fireEvent.press(screen.getByTestId('button'));
await unmount();
```

`testing-library/no-await-sync-events` is disabled for test files because the
rule still assumes the pre-v14 API. Do not "fix" the warning by removing the
`await` — the act flush depends on it.

## Rendering components

Always use `renderWithProviders` from `@/test/utils`. It wraps the tree in
`QueryClientProvider` (a fresh client per test), `SafeAreaProvider` and
`KeyboardProvider`, and re-exports everything from Testing Library, so one
import is enough.

```tsx
import { fireEvent, renderWithProviders, screen } from '@/test/utils';

import Button from './index';

it('calls onPress when pressed', async () => {
  const onPress = jest.fn();
  await renderWithProviders(
    <Button testID="button" text="Send" onPress={onPress} />,
  );

  await fireEvent.press(screen.getByTestId('button'));

  expect(onPress).toHaveBeenCalledTimes(1);
});
```

`render` exported from `@/test/utils` is an alias of `renderWithProviders`, so
either name is safe. Never import `render` from `@testing-library/react-native`
directly — that one has no providers.

For hooks needing React Query, use `createWrapper()` as `renderHook`'s `wrapper`.

## Already mocked

`jest.setup.js` handles MMKV, SecureStore, Haptics, Worklets and Keyboard
Controller (via the library's official `react-native-keyboard-controller/jest`).
`jest.config.js` maps `*.svg` to `src/test/svg-mock.tsx`.

The SVG mapping is load-bearing: the SVG transformer does not run under Jest, so
without it any component rendering an `Icon` throws
`Element type is invalid … got: object`.

Adding a dependency with a native module? Check whether `jest-expo` auto-mocks
it — it only does so for Expo packages that ship their own `mocks/` folder.
If not, add a mock to `jest.setup.js`.

## Timers

Components using `useDisableDelay` (`Button`, `DefaultModalButton`) schedule a
1s timer. Use `jest.useFakeTimers()` in `beforeEach` and `jest.useRealTimers()`
in `afterEach`, or the timer leaks into the next test.

`act` accepts a synchronous callback — do not make it `async` just to satisfy
`require-await`:

```ts
await act(() => {
  jest.advanceTimersByTime(1000);
});
```

## What to test

Priority order:

1. **Pure functions** — `utils/validators.ts`, `utils/format.ts`. Highest value
   per line, no setup.
2. **Behavior we deliberately built** — the double-press guard, the API message
   extraction in `handleError`.
3. **Component contracts** — renders what it should, calls what it should.

Do not test library behavior, styling, or implementation details.

**Never derive an expected value from the function under test.** The CPF and
CNPJ fixtures in `validators.test.ts` had their check digits verified by hand
for this reason. A test that generates its own expectation validates nothing.

## Prove the test can fail

After writing a test, break the thing it covers and confirm it goes red. A test
that has never failed is not evidence.
