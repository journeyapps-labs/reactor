import * as React from 'react';
import { ReactorViewportMode, useReactorViewportMode } from './useReactorViewportMode';

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export type ReactorSizeSource = Size | { $size?: Size; size?: unknown };

export const size = <T,>(source: ReactorSizeSource, values: readonly [T, T, T]): T => {
  const resolvedSize = typeof source === 'string' ? source : (source.$size ?? source.size);
  if (resolvedSize === Size.SMALL) {
    return values[0];
  }
  if (resolvedSize === Size.LARGE) {
    return values[2];
  }
  return values[1];
};

export const getReactorBorderRadius = (resolvedSize: Size): number => size(resolvedSize, [6, 8, 10]);

export const ReactorSizeContext = React.createContext<Size | undefined>(undefined);

export interface ReactorSizeProviderProps {
  size: Size;
  children?: React.ReactNode;
}

export const ReactorSizeProvider: React.FC<ReactorSizeProviderProps> = (props) => {
  return <ReactorSizeContext.Provider value={props.size}>{props.children}</ReactorSizeContext.Provider>;
};

export const useReactorSize = (size?: Size, desktopFallback: Size = Size.SMALL): Size => {
  const contextSize = React.useContext(ReactorSizeContext);
  const viewportMode = useReactorViewportMode();

  return size ?? contextSize ?? (viewportMode === ReactorViewportMode.MOBILE ? Size.MEDIUM : desktopFallback);
};
