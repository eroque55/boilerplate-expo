# Architecture

## Folder map

```
src/
  app/                Routes. Expo Router, file-based.
    index.tsx         Anchor route. Dispatcher only — see conventions.
    (auth)/           Guarded by `!user`
    (main)/           Guarded by `!!user`
    _layout.tsx       Providers + ProtectedStack
  components/
    ui/               Generic pieces. Consumed by more than one screen.
    layout/           App chrome (TabBar, ErrorBoundary, screen shell).
    screens/          Mirror of app/. Single-screen components.
  constants/          Query keys. Never inline a key string.
  contexts/           React contexts (AuthContext)
  hooks/
    api/              Server calls. One hook per endpoint.
    common/           Reusable hooks, exported through index.ts
  services/
    api/              Raw API functions. No React.
    http.ts           Axios instance + request interceptor
    queryClient.ts    QueryClient singleton
  store/              Zustand stores
  test/               Test helpers. Never imported by app code.
  theme/              colors.ts (source of truth) + global.css
  types/              Domain types (TUser, TViaCEPResponse)
  utils/              Pure helpers. No React, no imports from components.
  validation/         Zod config (zod.ts) + form schemas (*.validation.ts)
@types/               Ambient declarations, module augmentation
```

## Layering

Dependencies point **downward only**. A lower layer must never import from a
higher one.

```
app/  →  components/  →  hooks/  →  services/  →  utils/ · types/
                     ↘  store/  ↗
```

`import/no-cycle` is an ESLint **error**, so a violation fails the lint. The
common way to create one is a low-level module importing a type from a
component. If a store needs a type used by a component, the type belongs in
the store and the component imports it — not the other way around.

## Data flow

```
Screen → hooks/api/useThing → services/api/thing → services/http (axios)
```

- `services/api/*` are plain async functions. No React, no hooks.
- `hooks/api/*` wrap them in `useQuery` / `useMutation`.
- Screens only ever touch `hooks/api/*`, never `services/` directly.

Mutations are preferred over queries for one-shot fetches the app triggers
deliberately. Only use `useQuery` when the data genuinely benefits from cache
and refetch.

## Components

Three buckets. Which one a component belongs to follows from a single rule:

> **A component lives at the lowest common ancestor of its consumers.**

| Consumers                           | Lives in                              |
| ----------------------------------- | ------------------------------------- |
| One parent component                | Nested inside that parent's folder    |
| Two siblings inside the same screen | Hoisted to their shared parent folder |
| More than one screen                | `components/ui/`                      |

`ui/` is not a special category — it is the root of that tree, the common
ancestor of everything. When a component in `screens/` gains a consumer in
another screen, it moves to `ui/`. Without that move, `screens/` fills up with
near-duplicates of the same card written three times.

`layout/` is the exception to the rule: it holds app chrome — the shell around
screens rather than content inside them (`TabBar`, `DefaultContainer`,
`ErrorBoundary`).

### Why `screens/` exists

Expo Router discovers routes with a recursive `require.context` over the app
root that matches **every** `.ts`/`.tsx` file, ignoring only `+html`,
`+native-intent`, `+api` and `+middleware`. There is no private-folder escape
hatch.

So `app/(main)/home/Chart.tsx` becomes the route `/home/Chart`. Nothing that is
not a route may live inside `app/` — which is exactly why single-screen
components need a mirror folder outside it.

`screens/` mirrors `app/` **literally**: route `app/(main)/home` maps to
`components/screens/main/home`. Same names, no translation step.

### Barrels

`ui/` and `layout/` each export through an `index.ts`, so screens import from
`@/components/ui` and `@/components/layout`.

`screens/` has **no barrel**. Its components are single-use; a barrel there
would only couple screens to each other.

Between siblings, import relatively (`../ComponentX`). Crossing into another
bucket, use `@/components/ui/ComponentX`. The lint rule that blocks `../../../`
doubles as a depth alarm: needing three levels up usually means the component
should already have been hoisted.

## Where to add things

| Adding                                     | Goes in                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| A screen                                   | `src/app/(auth)/` or `src/app/(main)/`, as `name/index.tsx`   |
| A component used by several screens        | `src/components/ui/Name/index.tsx` + export in `index.ts`     |
| App chrome (tab bar, screen shell)         | `src/components/layout/Name/index.tsx` + export in `index.ts` |
| A component used by one screen only        | `src/components/screens/<mirror of the route>/Name/index.tsx` |
| A sub-component used by one component only | Nested: `Parent/Child/index.tsx`                              |
| An endpoint                                | Function in `services/api/`, hook in `hooks/api/`             |
| A reusable hook                            | `hooks/common/`, exported through `hooks/common/index.ts`     |
| Global client state                        | `store/` (Zustand)                                            |
| A pure helper                              | `utils/`                                                      |
| A form schema                              | `validation/name.validation.ts`                               |
| A domain type                              | `types/`                                                      |

## Query keys

All keys live in `src/constants/queryKeys.ts` and are type-checked through
module augmentation in `@types/tanStack-query.d.ts`. Never inline a query key
string.

Mutations can declare `meta.invalidateQueries` — the `MutationCache` in
`services/queryClient.ts` invalidates it automatically on success.

## Providers

`app/_layout.tsx` mounts, outside in:

```
GestureHandlerRootView → QueryClientProvider → KeyboardProvider
  → SafeAreaProvider → AuthProvider → ProtectedStack
```

The `QueryClient` is a module singleton from `services/queryClient.ts`. Never
construct one inside a component — it would reset the cache on every render.
