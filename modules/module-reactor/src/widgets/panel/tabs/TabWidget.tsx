import * as _ from 'lodash';
import * as React from 'react';
import { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { WorkspaceCollectionModel, WorkspaceEngine, WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, ioc } from '../../../inversify.config';
import { ComboBoxStore } from '../../../stores/combo/ComboBoxStore';
import { IconWidget, ReactorIcon } from '../../icons/IconWidget';
import { observer } from 'mobx-react';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorTabFactoryModel, TAB_BAR_HEIGHT } from '../../../stores/workspace/react-workspaces/ReactorTabFactory';
import { ThemeStore } from '../../../stores/themes/ThemeStore';
import { theme, themed } from '../../../stores/themes/reactor-theme-fragment';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';

export interface TabWidgetProps {
  model: ReactorPanelModel;
  factory: ReactorPanelFactory;
  selected: boolean;
  title: string;
  titlePrimary?: string;
  engine: WorkspaceEngine;
  icon: ReactorIcon;
  indicator?: {
    color: string;
  };
}

export interface TabWidgetState {
  hover: boolean;
  clickStarted: boolean;
}

export interface ComboBoxItemAndBtn extends ComboBoxItem {
  action: (event: MouseEvent) => any;
}

namespace S {
  export const Container = themed.div<{ selected: boolean }>`
    background: ${(p) => (p.selected ? p.theme.panels.tabBackgroundSelected : p.theme.panels.background)};
    display: flex;
    margin-right: 1px;
    align-items: center;
    padding: 0 10px;
    height: ${TAB_BAR_HEIGHT - 4}px;
    overflow: hidden;
    cursor: pointer;
    border-left: solid 3px ${(p) => (p.selected ? p.theme.tabs.selectedAccentSingle : 'transparent')};
  `;

  export const Title = themed.div<{ selected: boolean }>`
    padding-left: 8px;
    padding-right: 8px;
    color: ${(p) => (p.selected ? p.theme.panels.tabForegroundSelected : p.theme.panels.tabForeground)};
    font-size: 14px;
    white-space: nowrap;
  `;

  export const TitlePrimary = themed.div<{ selected: boolean }>`
    padding-left: 8px;
    padding-right: 8px;
    color: ${(p) => (p.selected ? p.theme.panels.tabForegroundSelected : p.theme.panels.tabForeground)};
    font-size: 14px;
    white-space: nowrap;
    border-right: solid 1px ${(p) =>
      p.selected ? p.theme.panels.tabForegroundSelected : p.theme.panels.tabForeground};
    opacity: 0.7;
  `;

  export const MainIcon = themed(IconWidget)<{ selected: boolean }>`
    font-size: 14px;
    color: ${(p) => (p.selected ? p.theme.tabs.selectedAccentSingle : p.theme.panels.tabForeground)};
    max-height: 14px;
    line-height: 14px;
    vertical-align: middle;
  `;

  export const CloseIcon = themed(FontAwesomeIcon)<{ $hidden: boolean }>`
    color: ${(p) => p.theme.panels.tabForeground};
    cursor: pointer;
    font-size: 15px;
    opacity: 0.5;
    transition: transform 0.5s;
    visibility: ${(p) => (p.$hidden ? 'hidden' : 'visible')};
  `;

  export const Indicator = styled.div<{ color: string }>`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: ${(p) => p.color};
    margin-right: 8px;
  `;

  export const CloseIconContainer = themed.div`
    :hover svg {
      color: ${(p) => p.theme.panels.tabForegroundSelected};
      opacity: 1;
      transform: rotateZ(90deg);
    }`;
}

@observer
export class TabWidget extends React.Component<TabWidgetProps, TabWidgetState> {
  ref: React.RefObject<HTMLDivElement>;

  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  constructor(props: TabWidgetProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      hover: false,
      clickStarted: false
    };
  }

  componentDidMount(): void {
    this.scrollIntoView();
  }

  scrollIntoView() {
    if (this.props.selected) {
      _.defer(() => {
        this.ref.current?.scrollIntoView({});
      });
    }
  }

  componentDidUpdate(prevProps: Readonly<TabWidgetProps>, prevState: Readonly<TabWidgetState>, snapshot?: any): void {
    this.scrollIntoView();
  }

  getIcon() {
    return <S.MainIcon selected={this.props.selected} icon={this.props.icon} />;
  }

  getIndicator() {
    if (this.props.indicator) {
      return <S.Indicator color={this.props.indicator.color} />;
    }
    return null;
  }

  getPrimaryTitle() {
    if (this.props.titlePrimary) {
      return (
        <S.TitlePrimary selected={this.props.selected || this.state.hover}>{this.props.titlePrimary}</S.TitlePrimary>
      );
    }
    return null;
  }

  fullscreen = () => {
    ioc.get(WorkspaceStore).setFullscreenModel(this.props.model);
  };

  mouseUpHandler = (event: React.MouseEvent) => {
    if (this.state.clickStarted) {
      // LMB: 0, MMB: 1 , RMB: 2
      if (event.button === 1) {
        this.closeTab(event);
      }
    }

    this.setState({ clickStarted: false });
  };

  closeTab = (event) => {
    event.stopPropagation();
    this.props.model.delete();
    this.props.engine.normalize();
  };

  render() {
    return (
      <S.Container
        onDoubleClick={this.fullscreen}
        ref={this.ref}
        onContextMenu={async (event) => {
          event.stopPropagation();
          event.preventDefault();

          let items: ComboBoxItem[] = [
            {
              key: 'close',
              title: 'Close tab',
              group: 'tabs'
            },
            {
              key: 'other',
              title: 'Close others',
              group: 'tabs'
            },
            {
              key: 'all',
              title: 'Close all',
              group: 'tabs'
            },
            {
              key: 'fullscreen',
              title: 'Fullscreen',
              group: 'tabs'
            },
            {
              key: 'window',
              title: 'Open in window',
              group: 'tabs'
            }
          ];

          // we also want to merge any panel actions that might exist
          const factory = this.props.engine.getFactory(this.props.model);
          if (factory instanceof ReactorPanelFactory) {
            items = items.concat(
              factory
                .getAdditionalButtons({
                  engine: this.props.engine,
                  model: this.props.model
                })
                .map((btn) => {
                  const name = btn.label || btn.tooltip;
                  return {
                    group: 'action-buttons',
                    key: name,
                    icon: btn.icon,
                    color: ioc.get(ThemeStore).getCurrentTheme(theme).header.secondary,
                    title: name,
                    action: async (event) => {
                      btn.action(event);
                    }
                  };
                })
            );
          }

          const selection: ComboBoxItemAndBtn = (await this.comboBoxStore.showComboBox(items, event)) as any;
          if (!selection) {
            return;
          }

          // tab actions
          if (selection.group == 'tabs') {
            // fullscreen
            if (selection.key === 'fullscreen') {
              this.fullscreen();
            }
            if (selection.key === 'window') {
              this.props.model.delete();
              ioc.get(WorkspaceStore).addModelInWindow(this.props.model, {
                width: 400,
                height: 400
              });
            }
            // close
            else if (selection.key === 'close') {
              this.props.model.delete();
              this.props.engine.normalize();
            } else if (selection.key === 'other') {
              (this.props.model.parent as ReactorTabFactoryModel).children
                .filter((child) => {
                  return child.id !== this.props.model.id;
                })
                .forEach((child) => {
                  child.delete();
                });
              this.props.engine.normalize();
            }
            // delete all
            else if (selection.key === 'all') {
              (this.props.model.parent.parent as WorkspaceCollectionModel).replaceModel(
                this.props.model.parent,
                new ReactorTabFactoryModel().addModel(new WorkspaceModel('empty'))
              );
            }
          }

          // btn actions
          else {
            selection.action(event);
          }
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false,
            clickStarted: false
          });
        }}
        onMouseMove={() => {
          if (!this.state.hover) {
            this.setState({
              hover: true
            });
          }
        }}
        onMouseUp={this.mouseUpHandler}
        onMouseDown={() => {
          this.setState({ clickStarted: true });
        }}
        selected={this.props.selected}
      >
        {this.getIcon()}
        {this.getPrimaryTitle()}
        <S.Title selected={this.props.selected || this.state.hover}>{this.props.title}</S.Title>
        {this.getIndicator()}
        <S.CloseIconContainer onClick={this.closeTab}>
          <S.CloseIcon $hidden={!this.state.hover} icon="times-circle" />
        </S.CloseIconContainer>
      </S.Container>
    );
  }
}
