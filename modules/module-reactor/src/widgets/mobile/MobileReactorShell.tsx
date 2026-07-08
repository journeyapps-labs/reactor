import * as React from 'react';
import { observer } from 'mobx-react';

import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { MobileHeaderWidget } from './MobileHeaderWidget';
import { MobileWorkspaceDrawerWidget } from './MobileWorkspaceDrawerWidget';
import { MobileWorkspaceWidget } from './MobileWorkspaceWidget';

export interface MobileReactorShellProps {
  locked: boolean;
  logoClicked: (event: React.MouseEvent) => any;
  workspaceRef: React.RefObject<HTMLDivElement>;
}

namespace S {
  export const Shell = themed.div<{ locked: boolean }>`
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.workspace.background};
    ${(p) => (p.locked ? 'filter: blur(5px); pointer-events: none;' : '')};
  `;

  export const Content = styled.div`
    position: relative;
    flex-grow: 1;
    min-height: 0;
  `;
}

export const MobileReactorShell: React.FC<MobileReactorShellProps> = observer((props) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <S.Shell locked={props.locked}>
      <MobileHeaderWidget logoClicked={props.logoClicked} openDrawer={() => setDrawerOpen(true)} />
      <S.Content>
        <MobileWorkspaceWidget forwardRef={props.workspaceRef} />
      </S.Content>
      {drawerOpen ? <MobileWorkspaceDrawerWidget close={() => setDrawerOpen(false)} /> : null}
    </S.Shell>
  );
});
