import { useState, useEffect } from 'react';

// Breakpoint values matching our CSS
const breakpoints = {
  xs: 575.98,
  sm: 767.98,
  md: 991.98,
  lg: 1199.98,
  xl: Infinity
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Determine current breakpoint
      if (width <= breakpoints.xs) {
        setCurrentBreakpoint('xs');
      } else if (width <= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else if (width <= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width <= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else {
        setCurrentBreakpoint('xl');
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions
  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
  const isTablet = currentBreakpoint === 'md';
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl';
  const isSmallScreen = currentBreakpoint === 'xs';
  const isLargeScreen = currentBreakpoint === 'lg' || currentBreakpoint === 'xl';

  // Responsive value selector
  const getResponsiveValue = (values) => {
    if (typeof values === 'object' && values !== null) {
      return values[currentBreakpoint] || values.default || values.xl;
    }
    return values;
  };

  // Grid columns calculator
  const getGridColumns = (defaultCols = 1) => {
    const responsiveColumns = {
      xs: 1,
      sm: Math.min(2, defaultCols),
      md: Math.min(3, defaultCols),
      lg: Math.min(4, defaultCols),
      xl: defaultCols
    };
    return responsiveColumns[currentBreakpoint];
  };

  // Touch device detection
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Orientation detection
  const isLandscape = screenSize.width > screenSize.height;
  const isPortrait = screenSize.height >= screenSize.width;

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    isLandscape,
    isPortrait,
    isTouchDevice: isTouchDevice(),
    getResponsiveValue,
    getGridColumns,
    breakpoints
  };
};

export default useResponsive;