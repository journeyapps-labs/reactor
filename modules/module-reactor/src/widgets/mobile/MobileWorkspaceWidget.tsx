import * as React from 'react';
import { WorkspaceModel as StormWorkspaceModel } from '@projectstorm/react-workspaces-core';
import { observer } from 'mobx-react';

import { ioc } from '../../inversify.config';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorTabFactoryModel } from '../../stores/workspace/react-workspaces/ReactorTabFactory';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { MobileNavPillWidget } from './MobileNavPillWidget';
import { MobilePanelScreenWidget } from './MobilePanelScreenWidget';
import { MobileTabScreenWidget } from './MobileTabScreenWidget';
import { MobilePanelScreen, MobileScreen } from './MobileWorkspaceTypes';

export interface MobileWorkspaceWidgetProps {
  forwardRef: React.RefObject<HTMLDivElement>;
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
    background: ${(p) => p.theme.workspaceSubMenu.background};

    ::-webkit-scrollbar {
      display: none;
    }
  `;

  export const Content = styled.div`
    position: relative;
    flex-grow: 1;
    min-height: 0;
  `;

  export const Empty = themed.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.workspaceSubMenu.foreground};
    font-family: ${Fonts.PRIMARY};
  `;
}

const getPanelScreen = (workspaceStore: WorkspaceStore, model: StormWorkspaceModel): MobilePanelScreen | null => {
  if (!(model instanceof ReactorPanelModel)) {
    return null;
  }
  const factory = workspaceStore.engine.getFactory<ReactorPanelFactory>(model);
  if (!(factory instanceof ReactorPanelFactory)) {
    return null;
  }
  return {
    type: 'panel',
    id: model.id,
    title: factory.getSimpleName(model),
    model,
    factory
  };
};

const collectScreens = (workspaceStore: WorkspaceStore, model: StormWorkspaceModel, screens: MobileScreen[]) => {
  if (!model) {
    return;
  }

  if (model instanceof ReactorTabFactoryModel) {
    const panels = model.children.map((child) => getPanelScreen(workspaceStore, child)).filter((child) => !!child);
    if (panels.length > 0) {
      screens.push({
        type: 'tabs',
        id: model.id,
        title: panels.find((panel) => panel.model === model.getSelected())?.title || panels[0].title,
        model,
        panels
      });
    }
    return;
  }

  const panel = getPanelScreen(workspaceStore, model);
  if (panel) {
    screens.push(panel);
    return;
  }

  const children = (model as any).children as StormWorkspaceModel[];
  children?.forEach((child) => collectScreens(workspaceStore, child, screens));
};

const getScreens = (workspaceStore: WorkspaceStore): MobileScreen[] => {
  const screens: MobileScreen[] = [];
  collectScreens(workspaceStore, workspaceStore.fullscreenModel || workspaceStore.getRoot(), screens);
  return screens;
};

const renderScreen = (workspaceStore: WorkspaceStore, screen: MobileScreen) => {
  if (!screen) {
    return <S.Empty>No workspace panels</S.Empty>;
  }
  if (screen.type === 'tabs') {
    return <MobileTabScreenWidget engine={workspaceStore.engine} screen={screen} workspaceStore={workspaceStore} />;
  }
  return <MobilePanelScreenWidget engine={workspaceStore.engine} screen={screen} workspaceStore={workspaceStore} />;
};

export const MobileWorkspaceWidget: React.FC<MobileWorkspaceWidgetProps> = observer((props) => {
  const workspaceStore = ioc.get(WorkspaceStore);
  const [activeScreenId, setActiveScreenId] = React.useState<string>(null);
  const screens = getScreens(workspaceStore);
  const activeScreen = screens.find((screen) => screen.id === activeScreenId) || screens[0];

  return (
    <S.Container ref={props.forwardRef}>
      {screens.length > 1 ? (
        <S.ScreenNav>
          {screens.map((screen) => {
            return (
              <MobileNavPillWidget
                key={screen.id}
                selected={screen.id === activeScreen?.id}
                onClick={() => setActiveScreenId(screen.id)}
              >
                {screen.title}
              </MobileNavPillWidget>
            );
          })}
        </S.ScreenNav>
      ) : null}
      <S.Content>{renderScreen(workspaceStore, activeScreen)}</S.Content>
    </S.Container>
  );
});
