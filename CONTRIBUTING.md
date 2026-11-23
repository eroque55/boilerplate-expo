# Contributing

## Commit messages

Commits follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
and are written in **English**. A `commit-msg` hook (husky + commitlint) rejects
a message that breaks the rules below, and a CI job checks every commit and the
title of every pull request, so a hook skipped with `--no-verify` is still
caught.

### Format

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer(s)>
```

```
feat(auth): keep the session alive across refresh token rotations

The refresh token is single use, so the new pair returned by /auth/refresh
must replace the old one before the next request, or the user is logged out.

Refs: #42
```

### Type

| Type       | Use it for                                               | Release |
| ---------- | -------------------------------------------------------- | ------- |
| `feat`     | A new feature for the user or the consumer of the code   | minor   |
| `fix`      | A bug fix                                                | patch   |
| `perf`     | A change that makes something faster or lighter          | patch   |
| `refactor` | A code change that neither fixes a bug nor adds behavior | —       |
| `docs`     | Documentation only (README, `.claude/`, comments)        | —       |
| `test`     | Adding or fixing tests                                   | —       |
| `style`    | Formatting only (Prettier, whitespace), no logic change  | —       |
| `build`    | Build system, dependencies, `package.json`, native setup | —       |
| `ci`       | GitHub Actions and other CI configuration                | —       |
| `chore`    | Maintenance that fits none of the above                  | —       |
| `revert`   | Reverting a previous commit                              | —       |

The release column is what [semantic-release](https://semantic-release.gitbook.io/)
or [release-please](https://github.com/googleapis/release-please) infer from the
history, which is the main reason to keep the types honest.

### Scope

Optional, lowercase, and names the area of the code that changed. Suggested
scopes for this repository:

| Scope    | Area                                                  |
| -------- | ----------------------------------------------------- |
| `auth`   | `AuthContext`, session storage, route guards          |
| `http`   | `services/http.ts`, interceptors, token refresh       |
| `api`    | `services/api/*` and `hooks/api/*`                    |
| `ui`     | `components/ui/*`                                     |
| `layout` | `components/layout/*` and route layouts               |
| `theme`  | `theme/*`, NativeWind, dark mode                      |
| `native` | `app.json`, config plugins, anything needing prebuild |
| `deps`   | Dependency updates                                    |

Dependency bumps use `deps` (`chore(deps): bump axios to 1.21.1`).

### Subject

- Imperative mood, as if completing "This commit will…": `add`, `fix`, `remove`
  — not `added` or `adds`.
- Starts lowercase, no period at the end.
- The whole header (`type(scope): subject`) fits in 100 characters; aim for 72.
- Says **what** changed for a reader of `git log`, not which files were touched.

### Body

Optional. Separated from the header by a blank line. Explain **why** the change
was needed and anything a reviewer could not infer from the diff. Wrap at around
72 characters.

### Breaking changes

Add `!` after the type or scope **and** a `BREAKING CHANGE:` footer describing
the migration:

```
feat(auth)!: rename the session cookie keys

BREAKING CHANGE: existing sessions are dropped; users have to log in again.
```

### Footers

Use Git trailer syntax (`Token: value`), one per line, after the body:

- `Refs: #123` or `Closes: #123` to link an issue
- `Co-authored-by: Name <email>` for pair work
- `BREAKING CHANGE: …` as above

### Examples

```
feat(ui): add a Select component
fix(http): retry the original request after refreshing the token
docs: document the commit conventions
refactor(auth): move token storage into the session util
test(utils): cover RFC 9457 field errors in handleError
chore(deps): bump typescript to 6.0.3
ci: run commitlint on pull requests
revert: feat(ui): add a Select component
```

And messages the hook rejects:

```
Fixed login            # no type, past tense
feat: Add login.       # capitalized subject, trailing period
update stuff           # no type, says nothing
feat(Auth): add login  # scope must be lowercase
```

## Commits and pull requests

- One logical change per commit. A commit that needs "and" in its subject is
  usually two commits.
- Every commit should leave `yarn typecheck && yarn lint && yarn test` green.
- Name branches after the change: `feat/login-screen`, `fix/token-refresh`.
- Pull request titles follow the same format as a commit header: with squash
  merges, the title becomes the commit on `main`.
