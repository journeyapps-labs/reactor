import * as React from 'react';
import { WorkspaceEngine } from '@projectstorm/react-workspaces-core';

import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { MobileNavPillWidget } from './MobileNavPillWidget';
import { MobilePanelScreenWidget } from './MobilePanelScreenWidget';
import { MobileTabScreen } from './MobileWorkspaceTypes';

export interface MobileTabScreenWidgetProps {
  engine: WorkspaceEngine;
  screen: MobileTabScreen;
  workspaceStore: WorkspaceStore;
  showPanelTitle?: boolean;
}

namespace S {
  export const Container = themed.div`
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.workspace.background};
  `;

  export const ScreenNav = themed.div`
    flex-shrink: 0;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 8px;
    background: ${(p) => p.theme.mobileNavigation.background};

    ::-webkit-scrollbar {
      display: none;
    }
  `;

  export const Content = styled.div`
    position: relative;
    flex-grow: 1;
    min-height: 0;
  `;
}

export const MobileTabScreenWidget: React.FC<MobileTabScreenWidgetProps> = (props) => {
  const [, forceUpdate] = React.useReducer((count) => count + 1, 0);
  const selected = props.screen.model.getSelected();
  const activePanel = props.screen.panels.find((panel) => panel.model === selected) || props.screen.panels[0];

  return (
    <S.Container>
      {props.screen.panels.length > 1 ? (
        <S.ScreenNav>
          {props.screen.panels.map((panel) => {
            return (
              <MobileNavPillWidget
                key={panel.id}
                selected={panel.id === activePanel.id}
                onClick={() => {
                  props.screen.model.setSelected(panel.model);
                  forceUpdate();
                }}
              >
                {panel.title}
              </MobileNavPillWidget>
            );
          })}
        </S.ScreenNav>
      ) : null}
      <S.Content>
        <MobilePanelScreenWidget
          engine={props.engine}
          screen={activePanel}
          workspaceStore={props.workspaceStore}
          showTitle={props.showPanelTitle !== false && props.screen.panels.length <= 1}
        />
      </S.Content>
    </S.Container>
  );
};
