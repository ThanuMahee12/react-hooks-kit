# react-hooks-kit

A small, dependency-free collection of **reusable custom React hooks** designed to be shared across projects — either as a git submodule or by copying individual hooks.

Built on modern React primitives (`useReducer`, `useMemo`, `useCallback`, `useId`, `useTransition`, `useDeferredValue`), the hooks are framework-agnostic: they depend on **React only** — no Redux, no UI library, no data layer.

---

## Why this kit

- **Portable** — no coupling to a specific app, state manager, or component library.
- **Concurrent-ready** — hooks lean on React 18/19 features (transitions, deferred values) to keep the UI responsive.
- **Accessible by default** — stable `useId`-based identifiers for wiring ARIA attributes.
- **Drop-in** — consume the whole repo as a submodule, or copy a single file.

---

## Available hooks

| Hook | Purpose | Page |
|------|---------|------|
| `usePagination` | Client-side pagination with search/sort-friendly slicing, windowed page numbers, and concurrent-mode support | [[usePagination]] |
| `useForm` | Controlled-form state with validation, async submit, and stale-read-safe handling | [[useForm]] |
| `useModal` | Open/close state for modals with an optional data payload (add vs. edit) | [[useModal]] |
| `useResponsive` | Viewport size + breakpoint helpers, plus `useMediaQuery` and `BREAKPOINTS` | [[useResponsive]] |

> More hooks are added over time. Each gets its own reference page in the sidebar.

---

## Quick start

```js
import { usePagination } from './shared/hooks/usePagination';

function UserTable({ users }) {
  const {
    paginatedItems,
    currentPage,
    totalPages,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(users, 10);

  return (
    <>
      <ul>
        {paginatedItems.map((u) => <li key={u.id}>{u.name}</li>)}
      </ul>

      <nav aria-label="Pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        {pageNumbers.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`}>…</span>
            : <button key={p} aria-current={p === currentPage} onClick={() => goToPage(p)}>{p}</button>
        )}
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </nav>
    </>
  );
}
```

---

## Getting started

- **[[Installation]]** — add the kit to your project (submodule or copy).
- **[[Architecture]]** — how the kit is consumed and how docs auto-publish (with diagrams).
- **[[usePagination]]** — full API reference and recipes.
- **[[Contributing]]** — conventions for adding a new hook.

---

## Repository

- Source: https://github.com/ThanuMahee12/react-hooks-kit
- License: see the repository root.
