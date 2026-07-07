import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export type SurfaceDepth = 0 | 1 | 2 | 3;

export interface SurfaceWidgetProps {
  depth?: SurfaceDepth;
  selected?: boolean;
  className?: any;
  children?: React.ReactNode;
}

const SurfaceDepthContext = React.createContext<SurfaceDepth | -1>(-1);

const clampDepth = (depth: number): SurfaceDepth => {
  return Math.max(0, Math.min(3, depth)) as SurfaceDepth;
};

export const useSurfaceDepth = (depth?: SurfaceDepth): SurfaceDepth => {
  const parentDepth = React.useContext(SurfaceDepthContext);
  return depth ?? clampDepth(parentDepth + 1);
};

namespace S {
  export const Container = themed.div<{ $depth: SurfaceDepth; $selected?: boolean }>`
    background: ${(p) => p.theme.surfaces[`depth${p.$depth}Background`]};
    border: solid 1px
      ${(p) => (p.$selected ? p.theme.surfaces.selectedBorder : p.theme.surfaces[`depth${p.$depth}Border`])};
    border-radius: 6px;
    box-sizing: border-box;
  `;
}

export const SurfaceWidget: React.FC<SurfaceWidgetProps> = (props) => {
  const depth = useSurfaceDepth(props.depth);

  return (
    <SurfaceDepthContext.Provider value={depth}>
      <S.Container className={props.className} $depth={depth} $selected={props.selected}>
        {props.children}
      </S.Container>
    </SurfaceDepthContext.Provider>
  );
};
