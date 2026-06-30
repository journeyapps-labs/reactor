import * as React from 'react';
import { WorkspaceModel as StormWorkspaceModel } from '@projectstorm/react-workspaces-core';
import { observer } from 'mobx-react';

import { inject } from '../../inversify.config';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorTabFactoryModel } from '../../stores/workspace/react-workspaces/ReactorTabFactory';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { IconWidget } from '../icons/IconWidget';

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

  export const Pill = themed.button<{ selected: boolean }>`
    flex-shrink: 0;
    border: 0;
    border-radius: 999px;
    padding: 5px 10px;
    font-family: ${Fonts.PRIMARY};
    font-size: 13px;
    line-height: 16px;
    color: ${(p) => (p.selected ? p.theme.workspaceSubMenu.foregroundActive : p.theme.workspaceSubMenu.foreground)};
    background: ${(p) =>
      p.selected ? p.theme.workspaceSubMenu.backgroundActive : p.theme.workspaceSubMenu.background};
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

  export const Empty = themed.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.workspaceSubMenu.foreground};
    font-family: ${Fonts.PRIMARY};
  `;
}

interface MobilePanelScreen {
  type: 'panel';
  id: string;
  title: string;
  model: ReactorPanelModel;
  factory: ReactorPanelFactory;
}

interface MobileTabScreen {
  type: 'tabs';
  id: string;
  title: string;
  model: ReactorTabFactoryModel;
  panels: MobilePanelScreen[];
}

type MobileScreen = MobilePanelScreen | MobileTabScreen;

export interface MobileWorkspaceWidgetProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

export interface MobileWorkspaceWidgetState {
  activeScreenId: string;
}

@observer
export class MobileWorkspaceWidget extends React.Component<MobileWorkspaceWidgetProps, MobileWorkspaceWidgetState> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor(props: MobileWorkspaceWidgetProps) {
    super(props);
    this.state = {
      activeScreenId: null
    };
  }

  getPanelScreen(model: StormWorkspaceModel): MobilePanelScreen {
    if (!(model instanceof ReactorPanelModel)) {
      return null;
    }
    const factory = this.workspaceStore.engine.getFactory<ReactorPanelFactory>(model);
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
  }

  collectScreens(model: StormWorkspaceModel, screens: MobileScreen[]) {
    if (!model) {
      return;
    }

    if (model instanceof ReactorTabFactoryModel) {
      const panels = model.children.map((child) => this.getPanelScreen(child)).filter((child) => !!child);
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

    const panel = this.getPanelScreen(model);
    if (panel) {
      screens.push(panel);
      return;
    }

    const children = (model as any).children as StormWorkspaceModel[];
    children?.forEach((child) => this.collectScreens(child, screens));
  }

  getScreens(): MobileScreen[] {
    const screens: MobileScreen[] = [];
    this.collectScreens(this.workspaceStore.fullscreenModel || this.workspaceStore.getRoot(), screens);
    return screens;
  }

  getActiveScreen(screens: MobileScreen[]) {
    return screens.find((screen) => screen.id === this.state.activeScreenId) || screens[0];
  }

  renderScreenNav(screens: MobileScreen[], activeScreen: MobileScreen) {
    if (screens.length <= 1) {
      return null;
    }
    return (
      <S.ScreenNav>
        {screens.map((screen) => {
          return (
            <S.Pill
              key={screen.id}
              selected={screen.id === activeScreen.id}
              onClick={() => {
                this.setState({ activeScreenId: screen.id });
              }}
            >
              {screen.title}
            </S.Pill>
          );
        })}
      </S.ScreenNav>
    );
  }

  renderPanel(screen: MobilePanelScreen) {
    const event = {
      engine: this.workspaceStore.engine,
      model: screen.model
    } as any;

    return (
      <S.Container>
        <S.PanelHeader>
          <S.PanelTitle>{screen.title}</S.PanelTitle>
          {this.workspaceStore.fullscreenModel ? (
            <S.PanelCloseButton
              aria-label="Close fullscreen panel"
              onClick={() => {
                this.workspaceStore.setFullscreenModel(null);
              }}
            >
              <IconWidget icon="times" />
            </S.PanelCloseButton>
          ) : null}
        </S.PanelHeader>
        <S.Content>{screen.factory.generateContent(event)}</S.Content>
      </S.Container>
    );
  }

  renderTabScreen(screen: MobileTabScreen) {
    const selected = screen.model.getSelected();
    const activePanel = screen.panels.find((panel) => panel.model === selected) || screen.panels[0];

    return (
      <S.Container>
        {screen.panels.length > 1 ? (
          <S.ScreenNav>
            {screen.panels.map((panel) => {
              return (
                <S.Pill
                  key={panel.id}
                  selected={panel.id === activePanel.id}
                  onClick={() => {
                    screen.model.setSelected(panel.model);
                    this.forceUpdate();
                  }}
                >
                  {panel.title}
                </S.Pill>
              );
            })}
          </S.ScreenNav>
        ) : null}
        <S.Content>{this.renderPanel(activePanel)}</S.Content>
      </S.Container>
    );
  }

  renderActiveScreen(screen: MobileScreen) {
    if (!screen) {
      return <S.Empty>No workspace panels</S.Empty>;
    }
    if (screen.type === 'tabs') {
      return this.renderTabScreen(screen);
    }
    return this.renderPanel(screen);
  }

  render() {
    const screens = this.getScreens();
    const activeScreen = this.getActiveScreen(screens);

    return (
      <S.Container ref={this.props.forwardRef}>
        {this.renderScreenNav(screens, activeScreen)}
        <S.Content>{this.renderActiveScreen(activeScreen)}</S.Content>
      </S.Container>
    );
  }
}
