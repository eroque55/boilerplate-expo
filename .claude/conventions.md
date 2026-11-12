# Conventions

## Hard rules

Breaking any of these either fails the lint or breaks the app.

### Imports the linter blocks

| Never import                                         | Import instead                                      |
| ---------------------------------------------------- | --------------------------------------------------- |
| `Pressable` / `TouchableOpacity` from `react-native` | `@/components/ui`                                   |
| `Image` from `react-native` or `expo-image`          | `@/components/ui`                                   |
| `z` from `zod`                                       | `@/validation/zod` (configured with pt-BR messages) |
| Relative paths 3+ levels deep (`../../../`)          | The `@/` alias                                      |

### `src/app/index.tsx` stays a dispatcher

It is the anchor route. When a `Stack.Protected` guard drops, Expo Router
clears the group's history and returns there. Put a real screen in it and the
app gets stuck on that screen after logout. It renders `null` while loading
and a `<Redirect>` otherwise — nothing else.

### Colors come from `theme/colors.ts`

It is the single source of truth; `tailwind.config.mts` feeds it to Tailwind via
`@config`. Never hardcode a hex — `react-native/no-color-literals` is an error.
Use a Tailwind class or `colors.*`, and they will be the same value.

### Every visible `Text` needs both themes

React Native `Text` has no default color, so a class without a `dark:` variant
is wrong in one theme. Always pair them: `text-neutral-600 dark:text-neutral-300`.

### Language

Code, comments, commits, test names and file names in **English**. Portuguese
**only** for strings the user reads — UI copy, validation messages, error text.

## Style

- Components: arrow functions. `react/function-component-definition` enforces it.
- Types: `type`, not `interface`. `consistent-type-definitions` enforces it.
- Components live in `Name/index.tsx`. Sub-components nest in their parent's folder.
- Props of type "turn a default behavior off" are named `withoutX` (`withoutFeedback`,
  `withoutDelay`). Follow that when adding one.
- Imports are auto-grouped and alphabetized by `import/order`. Run `yarn lint:fix`
  rather than sorting by hand.
- Don't write explanatory comments. The code and the type names carry the intent.
  Comment only what cannot be inferred: a lint rule disabled and why, or a
  non-obvious platform constraint.

## Promises

`@typescript-eslint/no-floating-promises` is an error. A fire-and-forget promise
must be marked with `void`:

```ts
void SplashScreen.hideAsync();
```

Async handlers on JSX props (`onPress={async () => …}`) are allowed —
`no-misused-promises` runs with `checksVoidReturn: { attributes: false }`.

## Intentionally unused arguments

Prefix with `_` — `no-unused-vars` runs with `argsIgnorePattern: '^_'`. Use it
when a signature requires a parameter the implementation does not consume yet
(as in the API stubs in `services/api/`). Do not delete the parameter.

## Before claiming work is done

Run all four and report the real exit codes. Never say something passes without
having run it.

```bash
yarn typecheck && yarn lint && yarn test && yarn doctor
```

`yarn lint` currently exits 0 with 5 known warnings — see `.claude/gotchas.md`.
Any warning beyond those five is yours.

## Native changes need a rebuild

Adding a config plugin to `app.json`, or any dependency with native code,
requires `npx expo prebuild --clean` and a fresh `yarn android` / `yarn ios`.
It cannot be tested over OTA or in Expo Go.
