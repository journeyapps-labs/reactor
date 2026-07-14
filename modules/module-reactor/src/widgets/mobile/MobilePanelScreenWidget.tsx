import * as React from 'react';
import { WorkspaceEngine } from '@projectstorm/react-workspaces-core';

import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { IconWidget } from '../icons/IconWidget';
import { MobilePanelScreen } from './MobileWorkspaceTypes';

export interface MobilePanelScreenWidgetProps {
  engine: WorkspaceEngine;
  screen: MobilePanelScreen;
  workspaceStore: WorkspaceStore;
  showTitle?: boolean;
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

  export const Content = styled.div`
    position: relative;
    flex-grow: 1;
    min-height: 0;
  `;

  export const PanelHeader = themed.div`
    min-height: 42px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px 0 12px;
    background: ${(p) => p.theme.panels.titleBackground};
    color: ${(p) => p.theme.panels.titleForeground};
  `;

  export const PanelTitle = themed.div`
    min-width: 0;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ${Fonts.PRIMARY};
    font-size: 18px;
    font-weight: 700;
  `;

  export const PanelCloseButton = themed.button`
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    color: ${(p) => p.theme.panels.titleForeground};
    background: transparent;
    font-size: 24px;
  `;
}

export const MobilePanelScreenWidget: React.FC<MobilePanelScreenWidgetProps> = (props) => {
  const event = {
    engine: props.engine,
    model: props.screen.model
  } as any;

  return (
    <S.Container>
      {props.showTitle !== false ? (
        <S.PanelHeader>
          <S.PanelTitle>{props.screen.title}</S.PanelTitle>
          {props.workspaceStore.fullscreenModel ? (
            <S.PanelCloseButton
              aria-label="Close fullscreen panel"
              onClick={() => {
                props.workspaceStore.setFullscreenModel(null);
              }}
            >
              <IconWidget icon="times" />
            </S.PanelCloseButton>
          ) : null}
        </S.PanelHeader>
      ) : null}
      <S.Content>{props.screen.factory.generateContent(event)}</S.Content>
    </S.Container>
  );
};
