# react-hooks-kit

A small, **dependency-free** collection of reusable custom React hooks, designed to be shared across projects as a git submodule (or by copying individual files). React-only — no Redux, router, UI library, or data layer.

Built on modern React primitives (`useReducer`, `useMemo`, `useCallback`, `useId`, `useTransition`, `useDeferredValue`).

## Hooks

| Hook | Description |
|------|-------------|
| [`usePagination`](https://github.com/ThanuMahee12/react-hooks-kit/wiki/usePagination) | Client-side pagination with search/sort-friendly slicing, windowed page numbers, and concurrent-mode support |

## Install (submodule)

```bash
git submodule add -b main git@github.com:ThanuMahee12/react-hooks-kit.git src/shared/hooks
```

```js
import { usePagination } from './shared/hooks/usePagination';
```

## Documentation

Full docs live in the **[Wiki](https://github.com/ThanuMahee12/react-hooks-kit/wiki)** — API reference, installation, and recipes.

> The wiki is generated from the [`wiki/`](./wiki) folder and published automatically on every push to `main`. Edit `wiki/`, not the wiki website.

## Requirements

React 18 or 19. No other runtime dependencies.

## Contributing

See the [Contributing guide](https://github.com/ThanuMahee12/react-hooks-kit/wiki/Contributing) and [`CLAUDE.md`](./CLAUDE.md).
