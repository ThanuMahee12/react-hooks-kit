import {
  useReducer,
  useMemo,
  useCallback,
  useId,
  useTransition,
  useDeferredValue,
} from 'react';

/**
 * Clamp a number into the inclusive [min, max] range.
 */
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

/** Lazy initializer for the reducer state. */
const init = (itemsPerPage) => ({ page: 1, itemsPerPage });

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.page };
    case 'SET_PER_PAGE':
      // Changing page size always returns to the first page
      return { page: 1, itemsPerPage: action.itemsPerPage };
    case 'RESET':
      return { ...state, page: 1 };
    default:
      return state;
  }
}

/**
 * Advanced client-side pagination hook.
 *
 * Built on modern React primitives:
 * - `useReducer`         coherent transitions for page + itemsPerPage
 * - `useDeferredValue`   keeps input/filtering responsive on large lists
 * - `useTransition`      page changes are non-urgent (no jank on big slices)
 * - `useId`              stable, SSR-safe ids for accessible controls
 * - `useMemo`/`useCallback` memoized derivations and stable handlers
 *
 * @param {Array}  items                 Full list to paginate.
 * @param {number} initialItemsPerPage   Rows per page (default: 10).
 * @param {Object} [options]
 * @param {boolean} [options.deferred=true]      Defer the source list for responsiveness.
 * @param {number}  [options.maxVisiblePages=5]  Max numbered buttons before ellipsis.
 * @returns {Object} Pagination state, data, a11y helpers, and handlers.
 */
export const usePagination = (items = [], initialItemsPerPage = 10, options = {}) => {
  const { deferred = true, maxVisiblePages = 5 } = options;

  const baseId = useId();
  const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useReducer(reducer, initialItemsPerPage, init);

  // Defer the heavy source so rapid upstream changes (typing/filtering) don't
  // block painting. The deferred copy may lag by a frame — that's the point.
  const deferredItems = useDeferredValue(items);
  const source = deferred ? deferredItems : items;
  const isStale = deferred && source !== items;

  const { itemsPerPage } = state;
  const totalItems = source.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Clamp at render time so the page stays valid even if `items` shrinks.
  const currentPage = clamp(state.page, 1, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return source.slice(start, start + itemsPerPage);
  }, [source, currentPage, itemsPerPage]);

  // --- handlers (page changes marked non-urgent via startTransition) ---------
  const goToPage = useCallback((page) => {
    startTransition(() => dispatch({ type: 'SET_PAGE', page }));
  }, []);

  const nextPage = useCallback(
    () => goToPage(currentPage + 1),
    [goToPage, currentPage]
  );
  const prevPage = useCallback(
    () => goToPage(currentPage - 1),
    [goToPage, currentPage]
  );
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    startTransition(() =>
      dispatch({ type: 'SET_PER_PAGE', itemsPerPage: newItemsPerPage })
    );
  }, []);

  const resetPagination = useCallback(() => {
    startTransition(() => dispatch({ type: 'RESET' }));
  }, []);

  // --- display info ----------------------------------------------------------
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Windowed page numbers with ellipsis, e.g. [1, '...', 4, 5, 6, '...', 20]
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) end = Math.min(4, totalPages - 1);
    if (currentPage >= totalPages - 2) start = Math.max(2, totalPages - 3);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Stable ids for wiring aria-controls / aria-current in the UI.
  const getPageId = useCallback(
    (page) => `${baseId}-page-${page}`,
    [baseId]
  );

  return {
    // State
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,

    // Paginated data
    paginatedItems,

    // Display info
    startItem,
    endItem,
    pageNumbers,

    // Navigation
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,

    // Settings
    changeItemsPerPage,
    resetPagination,

    // Concurrent-mode status
    isPending, // a transition (page/perPage change) is in flight
    isStale,   // showing a deferred (slightly outdated) source list

    // Accessibility
    paginationId: baseId,
    getPageId,

    // Flags
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};

export default usePagination;
