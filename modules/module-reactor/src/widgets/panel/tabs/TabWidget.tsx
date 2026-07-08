import * as _ from 'lodash';
import * as React from 'react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { WorkspaceCollectionModel, WorkspaceEngine, WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ioc } from '../../../inversify.config';
import { IconWidget, ReactorIcon } from '../../icons/IconWidget';
import { observer } from 'mobx-react';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ReactorTabFactoryModel, TAB_BAR_HEIGHT } from '../../../stores/workspace/react-workspaces/ReactorTabFactory';
import { theme, themed } from '../../../stores/themes/reactor-theme-fragment';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { MousePosition } from '../../../layers/combo/SmartPositionWidget';
import { useLongPressContextMenu } from '../../../hooks/useLongPressContextMenu';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';
import { ComboBoxStore } from '../../../stores/combo/ComboBoxStore';
import { ThemeStore } from '../../../stores/themes/ThemeStore';

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

namespace S {
  export const Container = themed.div<{ selected: boolean }>`
    background: ${(p) => (p.selected ? p.theme.panels.tabBackgroundSelected : p.theme.panels.background)};
    display: flex;
    margin-right: 1px;
    align-items: center;
    padding: 0 10px;
    height: ${TAB_BAR_HEIGHT - 2}px;
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

export const TabWidget: React.FC<TabWidgetProps> = observer((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [clickStarted, setClickStarted] = useState(false);

  useEffect(() => {
    if (props.selected) {
      _.defer(() => {
        ref.current?.scrollIntoView({});
      });
    }
  }, [props.selected]);

  const fullscreen = React.useCallback(() => {
    ioc.get(WorkspaceStore).setFullscreenModel(props.model);
  }, [props.model]);

  const closeTab = (event) => {
    event.stopPropagation();
    props.model.delete();
    props.engine.normalize();
  };

  const mouseUpHandler = (event: React.MouseEvent) => {
    if (clickStarted) {
      // LMB: 0, MMB: 1 , RMB: 2
      if (event.button === 1) {
        closeTab(event);
      }
    }
    setClickStarted(false);
  };

  const getIndicator = () => {
    if (props.indicator) {
      return <S.Indicator color={props.indicator.color} />;
    }
    return null;
  };

  const getPrimaryTitle = () => {
    if (props.titlePrimary) {
      return <S.TitlePrimary selected={props.selected || hover}>{props.titlePrimary}</S.TitlePrimary>;
    }
    return null;
  };

  const showContextMenu = React.useCallback(
    async (position: MousePosition) => {
      const items: ComboBoxItem[] = [
        {
          key: 'close',
          title: 'Close tab',
          group: 'tabs',
          action: async () => {
            props.model.delete();
            props.engine.normalize();
          }
        },
        {
          key: 'other',
          title: 'Close others',
          group: 'tabs',
          action: async () => {
            (props.model.parent as ReactorTabFactoryModel).children
              .filter((child) => child.id !== props.model.id)
              .forEach((child) => child.delete());
            props.engine.normalize();
          }
        },
        {
          key: 'all',
          title: 'Close all',
          group: 'tabs',
          action: async () => {
            (props.model.parent.parent as WorkspaceCollectionModel).replaceModel(
              props.model.parent,
              new ReactorTabFactoryModel().addModel(new WorkspaceModel('empty'))
            );
          }
        },
        {
          key: 'fullscreen',
          title: 'Fullscreen',
          group: 'tabs',
          action: async () => fullscreen()
        },
        {
          key: 'window',
          title: 'Open in window',
          group: 'tabs',
          action: async () => {
            props.model.delete();
            ioc.get(WorkspaceStore).addModelInWindow(props.model, {
              width: 400,
              height: 400
            });
          }
        },
        ...props.factory
          .getAdditionalButtons({
            engine: props.engine,
            model: props.model
          })
          .map((btn) => {
            const name = btn.label || btn.tooltip;
            return {
              group: 'action-buttons',
              key: name,
              icon: btn.icon,
              color: ioc.get(ThemeStore).getCurrentTheme(theme).header.secondary,
              title: name,
              action: async (event: MousePosition) => {
                btn.action(event);
              }
            };
          })
      ];

      const selection = await ioc.get(ComboBoxStore).showComboBox(items, position);
      await selection?.action?.(position);
    },
    [fullscreen, props.engine, props.factory, props.model]
  );
  useLongPressContextMenu(ref, showContextMenu);

  return (
    <S.Container
      onDoubleClick={fullscreen}
      ref={ref}
      onMouseLeave={() => {
        setHover(false);
        setClickStarted(false);
      }}
      onMouseMove={() => {
        if (!hover) {
          setHover(true);
        }
      }}
      onMouseUp={mouseUpHandler}
      onMouseDown={() => {
        setClickStarted(true);
      }}
      selected={props.selected}
    >
      <S.MainIcon selected={props.selected} icon={props.icon} />
      {getPrimaryTitle()}
      <S.Title selected={props.selected || hover}>{props.title}</S.Title>
      {getIndicator()}
      <S.CloseIconContainer onClick={closeTab}>
        <S.CloseIcon $hidden={!hover} icon="times-circle" />
      </S.CloseIconContainer>
    </S.Container>
  );
});
