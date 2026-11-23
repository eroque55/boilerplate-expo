# Expo Boilerplate

An opinionated Expo template with batteries included: authentication flow, encrypted
storage, a UI kit, testing set up and linting that enforces the conventions instead of
just documenting them.

It is the mobile companion of [boilerplate-api](https://github.com/eroque55/boilerplate-api)
(NestJS) and speaks its contract out of the box: JWT access tokens, rotating
refresh tokens and RFC 9457 error responses.

## Stack

|                                                  |                                            |
| ------------------------------------------------ | ------------------------------------------ |
| **Expo SDK 58** · React Native 0.88 · React 19.3 | New Architecture, React Compiler enabled   |
| **Expo Router**                                  | File-based routing with typed routes       |
| **NativeWind 5** + Tailwind 4                    | Styling, with the palette shared with JS   |
| **TanStack Query 5**                             | Server state                               |
| **Zustand 5**                                    | Client state                               |
| **React Hook Form** + **Zod 4**                  | Forms and validation, pt-BR error messages |
| **MMKV 4** + **SecureStore**                     | Encrypted local storage                    |
| **Reanimated 4** + **Gesture Handler**           | Animation                                  |
| **Jest** + **Testing Library**                   | Testing                                    |

## Get started

1. Start [boilerplate-api](https://github.com/eroque55/boilerplate-api)
   (`yarn db:up && yarn db:migrate && yarn db:seed && yarn dev`) on the same
   machine. In development the app finds it on port 3333 of the computer running
   Metro, so emulators and physical devices on the same network work without
   configuration. To use another API, copy `.env.example` to `.env` and set
   `EXPO_PUBLIC_API_URL`.

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a development build — Expo Go is not enough, the project uses native modules:

   ```bash
   yarn android
   # or
   yarn ios
   ```

4. Start the development server:

   ```bash
   yarn start
   ```

## First things to change

1. Replace `changeme` — it appears 5× in `app.json` (`name`, `slug`, `scheme`,
   `ios.bundleIdentifier`, `android.package`) and once in `package.json`.

2. Set `EXPO_PUBLIC_API_URL` (with the `/v1` prefix) for preview and production
   builds — it is required outside development.

3. Replace the icons in `assets/expo/`. [This Figma template](https://www.figma.com/community/file/1466490409418563617/expo-app-icon-splash-v2-community)
   generates every size you need.

## Project structure

```
src/
  app/              Routes (Expo Router)
    index.tsx       Anchor route — a dispatcher, never a screen. See "Navigation".
    (auth)/         Reachable only when logged out
    (main)/         Reachable only when logged in
  components/ui/    UI kit
  contexts/         AuthContext
  hooks/
    api/            Server calls (React Query)
    common/         Reusable hooks
  services/         HTTP client, API layer, QueryClient singleton
  store/            Zustand stores
  test/             Test helpers (renderWithProviders, svg mock)
  theme/            colors.ts and global.css
  types/            Domain types
  utils/            Pure helpers (format, validators, storage, haptics)
  validation/       Zod config and form schemas
@types/             Ambient declarations and module augmentation
```

## What's included

**Authentication** — `AuthContext`, `utils/session.ts` and `services/http.ts` talk to the
API's `/auth/login`, `/auth/refresh`, `/auth/logout` and `/users/me`. "Manter-me conectado"
decides whether the tokens are written to encrypted storage or kept in memory only.
Concurrent 401s share a single refresh promise, so a rotating refresh token never gets
invalidated by a stampede, and logout revokes the refresh token on the server.

**Navigation** — route groups are guarded with `Stack.Protected`, so there is no state where
you are in `(main)` without a user or in `(auth)` with one. `app/index.tsx` is the anchor
route (`unstable_settings.anchor`): when a guard is false, Expo Router redirects there. Keep
it a dispatcher that redirects — **never** put a real screen in it, or the app will get stuck
there on logout.

**Storage** — `utils/storage.ts` exposes an MMKV instance encrypted with AES-256. The key is
generated on device and kept in the Keychain / Keystore, never in the bundle. If the secure
store is unavailable it degrades to unencrypted rather than crashing at boot.

**Error handling** — every failed mutation goes through `handleError`, which reads the pt-BR
`detail` of the API's RFC 9457 Problem Details, and surfaces it in the global modal with an
error haptic. `getFieldErrors` maps a `422`'s `errors[].pointer` to form field names.

**Haptics** — `triggerHaptic('press' | 'success' | 'toggleOn' | ...)` states _what happened_
and maps it to each platform's native vocabulary. On Android it uses
`performAndroidHapticsAsync` rather than the raw `Vibrator`, which is barely perceptible.
Every `Pressable` fires one by default; opt out with `haptic={false}`.

**Theme** — `theme/colors.ts` is the single source of truth. `tailwind.config.mts` feeds it to
Tailwind through `@config`, so `text-primary` in a class and `colors.primary` in JS are
always the same value.

## Conventions

**Enforced by ESLint** (these fail the lint, they are not suggestions):

- Import `Pressable` and `Image` from `@/components/ui`, never from `react-native` or `expo-image`
- Import `z` from `@/validation/zod`, never from `zod` — the local one is configured with pt-BR messages
- No relative imports deeper than two levels; use the `@/` alias
- Imports are grouped and alphabetized

**By agreement:**

- Code in English. Portuguese only for strings the user reads.
- Components live in `Component/index.tsx`, with sub-components in nested folders.
- Prefer `type` over `interface`.

## Testing

Tests live next to the code they cover: `validators.ts` → `validators.test.ts`,
`Button/index.tsx` → `Button/index.test.tsx`.

```bash
yarn test              # run once
yarn test:watch        # watch mode
yarn test:coverage     # report in coverage/lcov-report/index.html
```

### Writing a component test

Use `renderWithProviders` from `@/test/utils`, which wraps the component in
`QueryClientProvider` (a fresh client per test), `SafeAreaProvider` and `KeyboardProvider`.
It also re-exports everything from Testing Library, so a single import is enough:

```tsx
import { fireEvent, renderWithProviders, screen } from '@/test/utils';

it('calls onPress when pressed', async () => {
  const onPress = jest.fn();
  await renderWithProviders(
    <Button testID="button" text="Send" onPress={onPress} />,
  );

  await fireEvent.press(screen.getByTestId('button'));

  expect(onPress).toHaveBeenCalledTimes(1);
});
```

> **Testing Library v14 is async.** `render`, `renderHook`, `fireEvent.*` and `unmount` all
> return a Promise and must be awaited. Older examples you find online will not work.
> The `testing-library/no-await-sync-events` rule is turned off for test files because it
> still assumes the synchronous API of earlier versions.

### What is already mocked

`jest.setup.js` mocks MMKV, SecureStore, Haptics, Worklets and Keyboard Controller. SVG
imports are mapped to `src/test/svg-mock.tsx`, since the SVG transformer does not run under
Jest and any component rendering an `Icon` would break without it.

## Useful commands

```bash
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint
yarn lint:fix       # ESLint with --fix
yarn format         # Prettier over the whole project
yarn doctor         # expo-doctor: dependency and config health
```

## Building an APK

1. Install the EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Log in:

   ```bash
   eas login
   ```

3. Configure the project (creates `eas.json`):

   ```bash
   eas build:configure
   eas update:configure
   ```

4. Build:

   ```bash
   eas build --platform android --profile preview
   ```

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) in
English, enforced by a commitlint hook and CI. See
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Author

Built and maintained by **Eduardo Roque** — [@eroque55](https://github.com/eroque55).
