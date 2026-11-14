import { useState, useEffect, useCallback } from 'react';

/**
 * Breakpoint values (matches Bootstrap 5).
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

/**
 * Track the viewport size and derive breakpoint helpers.
 * SSR-safe: falls back to 0x0 until the window is available.
 *
 * @returns {Object} Dimensions + breakpoint flags.
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const { width } = windowSize;

  return {
    // Dimensions
    width: windowSize.width,
    height: windowSize.height,

    // Exact breakpoint band
    isXs: width < BREAKPOINTS.sm,
    isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS.xxl,
    isXxl: width >= BREAKPOINTS.xxl,

    // Common groupings
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,

    // Min-width (like @media (min-width))
    isSmUp: width >= BREAKPOINTS.sm,
    isMdUp: width >= BREAKPOINTS.md,
    isLgUp: width >= BREAKPOINTS.lg,
    isXlUp: width >= BREAKPOINTS.xl,

    // Max-width (like @media (max-width))
    isSmDown: width < BREAKPOINTS.md,
    isMdDown: width < BREAKPOINTS.lg,
    isLgDown: width < BREAKPOINTS.xl,

    // Current breakpoint name
    breakpoint:
      width < BREAKPOINTS.sm ? 'xs' :
      width < BREAKPOINTS.md ? 'sm' :
      width < BREAKPOINTS.lg ? 'md' :
      width < BREAKPOINTS.xl ? 'lg' :
      width < BREAKPOINTS.xxl ? 'xl' : 'xxl',
  };
};

/**
 * Subscribe to an arbitrary CSS media query.
 *
 * @param {string} query CSS media query string, e.g. '(min-width: 768px)'.
 * @returns {boolean} Whether the query currently matches.
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useResponsive;
