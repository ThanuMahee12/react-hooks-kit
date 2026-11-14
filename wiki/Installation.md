# Installation

`react-hooks-kit` is distributed as source. There are two supported ways to consume it.

---

## Option A — Git submodule (recommended for shared use)

Mount the kit inside your app's source tree so multiple projects can share and update it from one place.

```bash
# From your app repository root
git submodule add -b main \
  git@github.com:ThanuMahee12/react-hooks-kit.git \
  src/shared/hooks

git commit -m "chore: add react-hooks-kit shared hooks submodule"
```

Clone a project that already uses it **with submodules**:

```bash
git clone --recurse-submodules <your-app-repo>
# or, in an existing clone:
git submodule update --init --recursive
```

Pull the latest hooks later:

```bash
git submodule update --remote src/shared/hooks
git add src/shared/hooks
git commit -m "chore: bump react-hooks-kit submodule"
```

### Importing

The kit exposes hooks as individual files (no build step):

```js
import { usePagination } from './shared/hooks/usePagination';
```

Adjust the relative path to wherever you mounted the submodule
(e.g. `../../shared/hooks/usePagination`).

---

## Option B — Copy a single hook

If you only need one hook and don't want a submodule, copy the file directly into your project (for example `src/hooks/usePagination.js`) and import it locally. The hooks have **no inter-dependencies**, so each file is self-contained.

---

## CI / CD note

Because the hooks live in a submodule, your pipeline must **check out submodules** or the import will fail to resolve at build time.

**GitHub Actions** (`actions/checkout`):

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true   # or: recursive
```

If the kit repository is **private**, the default `GITHUB_TOKEN` cannot read it — either make the repo public, or pass a token/deploy key with read access:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
    token: ${{ secrets.SUBMODULE_PAT }}
```

---

## Requirements

- **React** 18 or 19 (hooks rely on `useTransition` / `useDeferredValue` / `useId`).
- No other runtime dependencies.
