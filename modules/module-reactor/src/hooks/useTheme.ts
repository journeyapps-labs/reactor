import { useEffect } from 'react';
import { ioc } from '../inversify.config';
import { ThemeStore } from '../stores/themes/ThemeStore';
import type { GetTheme, ThemeFragment } from '../stores/themes/ThemeFragment';
import { theme as reactorTheme } from '../stores/themes/reactor-theme-fragment';
import { useForceUpdate } from './useForceUpdate';

type ThemeValues<T extends ThemeFragment> = GetTheme<T> & { light: boolean };

/**
 * Reads a specific Reactor theme fragment and refreshes when the selected
 * theme changes. The fragment argument keeps the result type-safe for module
 * supplied theme fragments.
 */
export function useTheme<T extends ThemeFragment = typeof reactorTheme>(fragment?: T): ThemeValues<T> {
  const requestedFragment = (fragment || reactorTheme) as T;
  const themeStore = ioc.get(ThemeStore);
  const forceUpdate = useForceUpdate();

  useEffect(() => themeStore.registerListener({ themeChanged: () => forceUpdate() }), [themeStore]);

  return themeStore.getCurrentTheme(requestedFragment);
}
