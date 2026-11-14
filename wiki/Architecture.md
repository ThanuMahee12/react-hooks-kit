# Architecture

How the kit is organized, how it's consumed, and how the documentation stays in sync.

---

## Consumption — library ⇄ app

`react-hooks-kit` is a standalone library. Apps mount it as a **git submodule** and import hooks directly; there is no build or package step.

```mermaid
flowchart LR
  subgraph kit["react-hooks-kit (library)"]
    hook["usePagination.js"]
    wikisrc["wiki/ (docs source)"]
    wf[".github/workflows/\npublish-wiki.yml"]
  end

  subgraph app["ah-wellness-hub-website (consumer app)"]
    sub["src/shared/hooks\n(submodule)"]
    table["EnhancedCRUDTable"]
    pages["CRUD pages\n(Patients, Tests, ...)"]
  end

  gwiki[["GitHub Wiki"]]

  hook -- "git submodule (pinned commit)" --> sub
  sub --> table
  table --> pages

  wikisrc -- "push to main (wiki/**)" --> wf
  wf -- "auto-sync" --> gwiki
```

- The app **pins** a specific commit of the library (the submodule pointer). It only moves when the app deliberately bumps it.
- `EnhancedCRUDTable` is the single wiring point; every CRUD page inherits pagination through it.

---

## Documentation pipeline

The GitHub Wiki is **generated**, never edited by hand. The `wiki/` folder in the repo is the source of truth.

```mermaid
flowchart TD
  edit["Edit wiki/*.md"] --> push["Push to main"]
  push --> trig{"path matches\nwiki/** ?"}
  trig -- no --> skip["No publish"]
  trig -- yes --> job["Publish Wiki workflow"]
  job --> clone["Clone <repo>.wiki.git"]
  clone --> mirror["Mirror wiki/ into wiki repo"]
  mirror --> diff{"changes?"}
  diff -- no --> done["Up to date"]
  diff -- yes --> commit["Commit as github-actions[bot]"]
  commit --> publish[["Push to wiki master"]]
```

> Editing the wiki on github.com directly is overwritten on the next publish. Always change `wiki/`.

---

## Hook data pipeline (`usePagination`)

Each hook is self-contained. `usePagination` turns an input array into the current page's slice; filtering and sorting happen **upstream**, in the consumer.

```mermaid
flowchart TD
  items["items (filtered + sorted upstream)"] --> deferred{"options.deferred?"}
  deferred -- "yes (default)" --> udv["useDeferredValue()"]
  deferred -- "no" --> src
  udv --> src["source list"]
  src --> totals["totalItems / totalPages"]
  state["reducer state\n{ page, itemsPerPage }"] --> clamp["clamp currentPage\nto [1, totalPages]"]
  totals --> clamp
  clamp --> memo["useMemo: slice page"]
  src --> memo
  memo --> out["paginatedItems"]
  clamp --> window["useMemo: pageNumbers\n(windowed + ellipsis)"]
```

See the full API and more diagrams on the [[usePagination]] page.

---

## See also

- [[usePagination]] — API reference, reducer state machine, sequence diagram
- [[Installation]] — submodule + CI setup
- [[Contributing]] — conventions and the docs rule
