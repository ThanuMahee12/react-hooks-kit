# useResponsive

Track the viewport size and derive breakpoint helpers for responsive behavior in JS (when CSS media queries aren't enough). Ships with a companion `useMediaQuery` and the `BREAKPOINTS` map.

```js
import { useResponsive, useMediaQuery, BREAKPOINTS } from './shared/hooks/useResponsive';
```

---

## `useResponsive()`

### Signature

```ts
useResponsive(): ResponsiveResult
```

### Return value

| Group | Keys | Description |
|-------|------|-------------|
| Dimensions | `width`, `height` | Current viewport size (SSR-safe: `0` until the window exists). |
| Exact band | `isXs`, `isSm`, `isMd`, `isLg`, `isXl`, `isXxl` | True for exactly one band at a time. |
| Groupings | `isMobile` (`< md`), `isTablet` (`md–lg`), `isDesktop` (`≥ lg`) | Common coarse buckets. |
| Min-width | `isSmUp`, `isMdUp`, `isLgUp`, `isXlUp` | Like `@media (min-width: …)`. |
| Max-width | `isSmDown`, `isMdDown`, `isLgDown` | Like `@media (max-width: …)`. |
| Name | `breakpoint` | Current band as a string: `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'`. |

---

## `useMediaQuery(query)`

### Signature

```ts
useMediaQuery(query: string): boolean
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string` | Any CSS media query, e.g. `'(min-width: 768px)'` or `'(prefers-color-scheme: dark)'`. |

Returns a boolean that updates when the match state changes.

---

## `BREAKPOINTS`

Bootstrap-5 aligned pixel values, exported for reuse:

```js
{ xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 }
```

---

## Behavior notes

- **SSR-safe.** Both hooks guard `window`, returning `0`/`false` on the server and attaching listeners only in the browser.
- **Listeners cleaned up.** `resize` and `matchMedia` `change` listeners are removed on unmount.
- **Prefer CSS first.** Use this only when layout logic genuinely needs to live in JS (conditional rendering, computed props). Pure styling should stay in CSS media queries.

---

## Recipe — adapt rendering to the viewport

```js
function Toolbar() {
  const { isMobile, breakpoint } = useResponsive();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div data-theme={prefersDark ? 'dark' : 'light'}>
      {isMobile ? <MenuButton /> : <FullNav />}
      <small>bp: {breakpoint}</small>
    </div>
  );
}
```

---

## React primitives used

| Primitive | Role in the hook |
|-----------|------------------|
| `useState` | Hold window size / match state. |
| `useEffect` | Subscribe to `resize` / `matchMedia` and clean up. |
| `useCallback` | Stable resize handler. |

---

## See also

- [[usePagination]] — often paired to switch table ↔ card layouts
- [[Home]]
