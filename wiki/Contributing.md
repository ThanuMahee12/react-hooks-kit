# Contributing

Guidelines for adding or changing hooks in `react-hooks-kit`.

---

## Principles

1. **React-only.** A hook must not depend on Redux, a router, a UI library, or any data layer. If it needs app context, it doesn't belong here.
2. **Self-contained.** Each hook lives in its own file with no imports from sibling hooks, so a single file can be copied out standalone.
3. **Prefer modern primitives.** Reach for `useReducer`, `useMemo`, `useCallback`, `useId`, `useTransition`, and `useDeferredValue` where they genuinely improve coherence, accessibility, or responsiveness — not for their own sake.
4. **Document the return shape.** Every returned key must be explained on the hook's wiki page.

---

## Adding a hook

1. Create `useYourHook.js` at the repository root.
2. Export a named hook: `export const useYourHook = (...) => { ... }`, plus a default export for convenience.
3. Write a wiki page `wiki/useYourHook.md` following the [[usePagination]] layout: **Signature → Parameters → Return value → Behavior notes → Recipe → Primitives used**.
4. Link it from `wiki/_Sidebar.md` and the "Available hooks" table on `wiki/Home.md`.
5. Open a PR. On merge to `main`, the wiki publishes automatically (see below).

---

## Documentation is the source of truth in `wiki/`

The GitHub Wiki is **not edited directly**. Its content is generated from the `wiki/` folder in this repository:

- Edit the markdown under `wiki/`.
- On every push to `main` that touches `wiki/**`, the **Publish Wiki** workflow (`.github/workflows/publish-wiki.yml`) syncs the folder to the GitHub Wiki.
- Manual edits made on the wiki website will be **overwritten** on the next publish — always change `wiki/` instead.

> Rule of thumb: **no hook change is complete without its wiki page updated in the same PR.**

---

## Naming & API conventions

- Hook names start with `use` and use camelCase.
- Return a **single object** (not a positional array) so consumers destructure only what they need.
- Group returned keys logically: data → state → helpers → handlers → flags.
- Handlers are stable (`useCallback`) so they're safe in dependency arrays.
- Guard against SSR: check `typeof window !== 'undefined'` before touching browser globals.

---

## Commit messages

Use Conventional Commits:

- `feat: add useYourHook`
- `fix: clamp page when list shrinks`
- `docs: expand usePagination recipes`
- `refactor:` / `chore:` for non-feature changes.

---

## Releasing to consumers

Consumers pin this repo as a submodule. After merging a change, each consuming app bumps its submodule pointer:

```bash
git submodule update --remote src/shared/hooks
git add src/shared/hooks
git commit -m "chore: bump react-hooks-kit submodule"
```

See [[Installation]] for the full submodule workflow and CI requirements.
