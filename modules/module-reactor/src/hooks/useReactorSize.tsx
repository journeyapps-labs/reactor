import * as React from 'react';
import { ReactorViewportMode, useReactorViewportMode } from './useReactorViewportMode';

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

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
