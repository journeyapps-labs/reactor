import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { getReactorBorderRadius, useReactorSize } from '../../hooks/useReactorSize';
import { useTheme } from '../../hooks/useTheme';

export type SurfaceDepth = 0 | 1 | 2 | 3;

export interface SurfaceWidgetProps {
  depth?: SurfaceDepth;
  selected?: boolean;
  className?: any;
  children?: React.ReactNode;
}

interface SurfaceContextValue {
  depth: SurfaceDepth | -1;
  borderColor?: string;
}

const SurfaceContext = React.createContext<SurfaceContextValue>({ depth: -1 });

const clampDepth = (depth: number): SurfaceDepth => {
  return Math.max(0, Math.min(3, depth)) as SurfaceDepth;
};

export const useSurfaceDepth = (depth?: SurfaceDepth): SurfaceDepth => {
  const parentSurface = React.useContext(SurfaceContext);
  return depth ?? clampDepth(parentSurface.depth + 1);
};

export const useSurfaceBorderColor = () => React.useContext(SurfaceContext).borderColor;

namespace S {
  export const Container = themed.div<{ $depth: SurfaceDepth; $borderColor: string; $radius: number }>`
    background: ${(p) => p.theme.surfaces[`depth${p.$depth}Background`]};
    border: solid 1px ${(p) => p.$borderColor};
    border-radius: ${(p) => p.$radius}px;
    box-sizing: border-box;
  `;
}

export const SurfaceWidget: React.FC<SurfaceWidgetProps> = (props) => {
  const depth = useSurfaceDepth(props.depth);
  const size = useReactorSize();
  const theme = useTheme();
  const borderColor = props.selected ? theme.surfaces.selectedBorder : theme.surfaces[`depth${depth}Border`];

  return (
    <SurfaceContext.Provider value={{ depth, borderColor }}>
      <S.Container
        className={props.className}
        $depth={depth}
        $borderColor={borderColor}
        $radius={getReactorBorderRadius(size)}
      >
        {props.children}
      </S.Container>
    </SurfaceContext.Provider>
  );
};
