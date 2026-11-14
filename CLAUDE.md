# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`react-hooks-kit` is a small, **dependency-free collection of reusable custom React hooks** meant to be shared across projects — consumed as a git submodule or by copying individual files. The hooks depend on **React only** (no Redux, router, UI library, or data layer).

It is currently consumed by the `AH-WELLNESS-HUB/ah-wellness-hub-website` app, mounted as a submodule at `src/shared/hooks`.

## Repository Structure

```
react-hooks-kit/
├── usePagination.js              # a hook (one file per hook, root level)
├── wiki/                         # SOURCE OF TRUTH for the GitHub Wiki
│   ├── Home.md
│   ├── _Sidebar.md               # wiki navigation
│   ├── _Footer.md
│   ├── Installation.md
│   ├── Contributing.md
│   └── usePagination.md          # one reference page per hook
├── .github/workflows/
│   └── publish-wiki.yml          # auto-publishes wiki/ → GitHub Wiki on push to main
├── README.md
└── CLAUDE.md
```

## Hooks

| Hook | File | Wiki page |
|------|------|-----------|
| `usePagination` | `usePagination.js` | `wiki/usePagination.md` |
| `useForm` | `useForm.js` | `wiki/useForm.md` |
| `useModal` | `useModal.js` | `wiki/useModal.md` |
| `useResponsive` | `useResponsive.js` | `wiki/useResponsive.md` |

## Documentation & the Wiki (IMPORTANT)

The GitHub Wiki is **generated**, never hand-edited on github.com.

- The `wiki/` folder in this repo is the **single source of truth**.
- On every push to `main` that changes `wiki/**`, the **Publish Wiki** workflow
  (`.github/workflows/publish-wiki.yml`) syncs the folder to the GitHub Wiki
  (pushing to the wiki's `master` branch).
- Edits made directly on the wiki website are **overwritten** on the next publish.

**Rule: a hook change is not complete until its `wiki/<hook>.md` page is updated in the same change.**
When you add, change, or remove a hook, you MUST also:
1. Update or create `wiki/<hook>.md` (Signature → Parameters → Return value → Behavior notes → Recipe → Primitives used).
2. Update the "Available hooks" table in `wiki/Home.md` and `CLAUDE.md`.
3. Add/remove the entry in `wiki/_Sidebar.md`.

## Code Conventions

- **React-only.** No external runtime dependencies. If a hook needs app context (store, router, services), it does not belong here.
- **Self-contained files.** A hook must not import from sibling hooks, so any single file can be copied out standalone.
- **Named + default export.** `export const useX = ...` and `export default useX;`.
- **Return a single object**, not a positional array — consumers destructure only what they need.
- **Group returned keys** logically: data → state → display helpers → handlers → settings → status/flags.
- **Stable handlers** via `useCallback` so they are safe in dependency arrays.
- **SSR-safe.** Guard browser globals with `typeof window !== 'undefined'`.
- **Prefer modern primitives** (`useReducer`, `useId`, `useTransition`, `useDeferredValue`) where they improve coherence, accessibility, or responsiveness — not gratuitously.

## Requirements

- **React 18 or 19** (hooks use `useTransition` / `useDeferredValue` / `useId`).
- No build step — hooks are plain ES modules imported directly.

## Git & Commits

- **Conventional Commits**: `feat:` (new hook/feature), `fix:`, `docs:`, `refactor:`, `chore:`.
- Author identity for this repo: `thanujan.tech@gmail.com`.
- Do **not** include a Claude Code signature in commit messages.

## Consuming this repo (for reference)

```bash
# Add as a submodule
git submodule add -b main git@github.com:ThanuMahee12/react-hooks-kit.git src/shared/hooks

# Import a hook
import { usePagination } from './shared/hooks/usePagination';
```

CI that builds a consumer must check out submodules (`actions/checkout` with `submodules: true`). See `wiki/Installation.md`.
