@AGENTS.md
@.claude/architecture.md
@.claude/conventions.md

# Project

Expo boilerplate. Every app starts from a clone of this, so a mistake here is
copied into every project — prefer the correct fix over the quick one.

**Stack:** Expo SDK 57 · React Native 0.86 · React 19.2 (Compiler on) ·
Expo Router (typed routes) · NativeWind 5 + Tailwind 4 · TanStack Query 5 ·
Zustand 5 · React Hook Form + Zod 4 · MMKV 4 + SecureStore · Reanimated 4 ·
Jest + Testing Library v14

## Commands

```bash
yarn start          # dev server
yarn android        # build and run (dev build required, Expo Go is not enough)
yarn ios
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint
yarn lint:fix
yarn format         # Prettier
yarn test           # Jest
yarn test:watch
yarn test:coverage
yarn doctor         # expo-doctor
```

## Read before acting

These carry decisions already made. Read the relevant file **before** writing
code in that area, not after something breaks.

| Before you                                        | Read                                     |
| ------------------------------------------------- | ---------------------------------------- |
| Write or change any test                          | `.claude/testing.md`                     |
| Touch navigation, guards or `app/index.tsx`       | `.claude/gotchas.md`                     |
| Touch storage, haptics, auth or the token refresh | `.claude/gotchas.md`                     |
| Add a component with default styles               | `.claude/gotchas.md`                     |
| See more than 5 lint warnings                     | `.claude/gotchas.md`                     |
| Add, remove or bump a dependency                  | `.claude/gotchas.md`, then `yarn doctor` |

## Non-negotiables

1. **Verify before claiming.** Run `yarn typecheck`, `yarn lint`, `yarn test`
   and report the real exit codes. Never state that something passes without
   having run it.
2. **`src/app/index.tsx` is a dispatcher**, never a screen.
3. **Colors come from `theme/colors.ts`.** No hardcoded hex anywhere.
4. **English in code, Portuguese only in strings the user reads.**
5. **Don't silence a lint rule to make a diff look clean.** If a rule is wrong,
   say why and disable it deliberately with the reason recorded.
6. **Expo SDK 57 changed a lot.** Check the versioned docs and the installed
   `.d.ts` in `node_modules` before assuming an API — several APIs in this
   project (Testing Library v14, `Stack.Protected`, `performAndroidHapticsAsync`)
   differ from what older examples show.

## State of the repo

All four commands are green. Keep them that way.

`yarn lint` exits 0 with **exactly 5** known warnings, listed in
`.claude/gotchas.md`. That number is a tripwire: a sixth warning means the
change introduced it, or that something was restored that should not have been.
