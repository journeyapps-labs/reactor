import { useEffect, useState } from 'react';

export enum ReactorViewportMode {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop'
}

export interface ReactorViewportBreakpoints {
  mobile: number;
  tablet: number;
}

export const REACTOR_VIEWPORT_BREAKPOINTS: ReactorViewportBreakpoints = {
  mobile: 720,
  tablet: 1100
};

export const REACTOR_MOBILE_MEDIA_QUERY = `@media (max-width: ${REACTOR_VIEWPORT_BREAKPOINTS.mobile - 1}px)`;
export const REACTOR_TABLET_MEDIA_QUERY = `@media (max-width: ${REACTOR_VIEWPORT_BREAKPOINTS.tablet - 1}px)`;

export const getReactorViewportMode = (
  breakpoints: ReactorViewportBreakpoints = REACTOR_VIEWPORT_BREAKPOINTS
): ReactorViewportMode => {
  if (typeof window === 'undefined') {
    return ReactorViewportMode.DESKTOP;
  }
  if (window.innerWidth < breakpoints.mobile) {
    return ReactorViewportMode.MOBILE;
  }
  if (window.innerWidth < breakpoints.tablet) {
    return ReactorViewportMode.TABLET;
  }
  return ReactorViewportMode.DESKTOP;
};

export const useReactorViewportMode = (breakpoints: ReactorViewportBreakpoints = REACTOR_VIEWPORT_BREAKPOINTS) => {
  const [mode, setMode] = useState<ReactorViewportMode>(() => getReactorViewportMode(breakpoints));

  useEffect(() => {
    const update = () => {
      setMode(getReactorViewportMode(breakpoints));
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, [breakpoints.mobile, breakpoints.tablet]);

  return mode;
};
