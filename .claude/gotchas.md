# Gotchas

Traps in this project that cost real debugging time. Each one is a decision
already made — do not undo it without reading why.

## The anchor route

`app/index.tsx` must stay a dispatcher.

When a `Stack.Protected` guard flips to false, Expo Router **removes every
history entry** for that group and falls back to the anchor route — the index
screen. If the index is a real screen (an intro, a splash, a landing), logout
lands there and stays there, because nothing moves it on.

Keeping it a dispatcher that renders `null` while loading and `<Redirect>`
otherwise makes both directions deterministic:

```
logout → (main) guard drops → history cleared → index → redirect /login
login  → (auth) guard drops → history cleared → index → redirect /home
```

An animated intro is **not** a route. Render it as an absolutely-positioned
overlay sibling of `<ProtectedStack />` in `_layout.tsx`, so it never enters
history and no guard can bounce to it.

## No default-className wrapper components

Tempting idea: a `<Text>` wrapper with a default `className` so nobody forgets
the color. It does not work reliably here.

`react-native-css` implements real CSS specificity, so under equal specificity
the winner is whichever class Tailwind emits **later in the stylesheet** — not
the one written last in `className`. Tailwind emits `.text-neutral-100` before
`.text-neutral-600`, so a wrapper defaulting to `neutral-600` silently beats a
caller passing `neutral-100`.

Making it predictable needs `tailwind-merge`, which is not installed. Write the
classes explicitly instead.

## Haptics on Android

Use `triggerHaptic()` from `@/utils/haptics`, never `Haptics.impactAsync`
directly.

On Android, `impactAsync` builds raw `Vibrator` waveforms at 12–27% amplitude
for 40–60ms — close to imperceptible, which reads as "haptics are broken".
The util routes Android through `performAndroidHapticsAsync`, which uses the
system haptic constants, respects the manufacturer's calibration, and needs no
`VIBRATE` permission.

Haptics require a **physical device**. Emulators have no vibration hardware.

## Storage degrades instead of crashing

`utils/storage.ts` runs at **import time**, before React mounts, so a throw
there kills the app on the splash with no `ErrorBoundary` to catch it. The
`try/catch` returning `undefined` is deliberate: MMKV then opens unencrypted
rather than the app dying.

`recoveryStrategy: 'discard-on-error'` is also deliberate — after a device
restore the Keystore key is gone but the encrypted file is back, and without it
the app cannot recover.

Changing `id` or `encryptionKey` orphans every existing user's data.

## The five known lint warnings

`yarn lint` exits 0 with exactly five warnings. They are understood, not
pending work:

| Where                           | Rule                              | Why it stays                                                                                                                                    |
| ------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Checkbox`, `Switch`, `Shimmer` | `react-hooks/immutability`        | `sharedValue.value = withTiming(…)` is the Reanimated idiom; the compiler rule does not model shared values                                     |
| `Input`                         | `react-hooks/refs`                | `ref={field.ref}` from react-hook-form                                                                                                          |
| `useUpdate`                     | `react-hooks/set-state-in-effect` | `checkForUpdates` is async — setState happens after an `await`, so there is no cascading render. The rule cannot see through the async boundary |

A sixth warning means you introduced it. Do not silence any of these with
`eslint-disable` to make a diff look clean.

## Token refresh is deduplicated

`AuthContext` shares one in-flight refresh promise. Concurrent 401s await the
same promise instead of each firing a refresh — with a rotating refresh token,
parallel refreshes invalidate each other and log the user out.

The whole `useCallback` chain (`fetchUser` → `logout` → `runRefresh` →
`refreshAccessToken`) exists so the interceptor effect registers **once**. It
relies on React Query's `mutateAsync` being a stable reference. Break that
chain and the interceptor re-registers every render, leaking handlers.

## API error messages

`handleError` reads `error.response.data`, not `error.message`. Axios's
`message` is `"Request failed with status code 400"` — showing it to the user
hides what the API actually said. Supported shapes: `{ message }`,
`{ error: { message } }` (Strapi), and a plain string.

## Never run a scaffolding command to diagnose

`expo lint` **generates** an `eslint.config.js` when it does not find one, and
adds `eslint` and `eslint-config-expo` to `package.json`. Running it to find out
why linting is broken therefore makes things worse: the 10-line stub it writes
shadows the real 275-line config, and the `package.json` / `yarn.lock` edits
block `git stash apply` and `git checkout`.

If the tooling looks broken — missing modules, a tool resolving to the wrong
version, `node_modules` out of sync with `package.json` — run `yarn install`
first and re-check. Only then run anything that can write files.

This matters here because the working tree is restored from a stash on every
machine switch, while `node_modules` is not.

## expo-doctor after dependency changes

`yarn doctor` validates that every package matches the SDK. Run it after any
install, remove or version change — it catches misalignment that `yarn install`
happily accepts.

SDK packages use `~` (patch only), never `^`.
