import * as React from 'react';
import {
  ExpandNodeModel,
  ExpandNodeWidget,
  useForceUpdate,
  useResizeObserver,
  WorkspaceEngine,
  WorkspaceModel,
  WorkspaceModelFactoryEvent,
  WorkspaceNodeFactory
} from '@projectstorm/react-workspaces-core';
import { ReactorPanelModel } from './ReactorPanelModel';
import { ThemeStore } from '../../themes/ThemeStore';
import { inject } from '../../../inversify.config';
import { styled, theme } from '../../themes/reactor-theme-fragment';
import { WORKSPACE_PANEL_INSET } from '../../../widgets/workspace/workspacePanelChrome';
import type { ResizeDimensionContainer } from '@projectstorm/react-workspaces-core/dist/@types/entities/node/ResizeDimensionContainer';

export const serializeChildren = (children: WorkspaceModel[]) => {
  return children
    .filter((child) => {
      // certain models we don't want to be serializable
      if (child instanceof ReactorPanelModel) {
        return child.isSerializable();
      }
      return true;
    })
    .map((m) => m.toArray());
};

export class ReactorWorkspaceNodeModel extends ExpandNodeModel {
  toArray() {
    const data = super.toArray();
    return {
      ...data,
      children: serializeChildren(this.children)
    };
  }
}

interface ReactorDividerWidgetProps {
  dimensionContainer: ResizeDimensionContainer;
  engine: WorkspaceEngine;
  hoverColor: string;
  activeColor: string;
}

const ReactorDividerWidget: React.FC<ReactorDividerWidgetProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    return props.dimensionContainer.registerListener({
      activeChanged: forceUpdate,
      hoverChanged: forceUpdate
    });
  }, []);

  useResizeObserver({
    forwardRef: ref,
    dimension: props.dimensionContainer,
    engine: props.engine
  });

  return (
    <S.Divider
      ref={ref}
      $hover={props.dimensionContainer.hover}
      $active={props.dimensionContainer.active}
      $hoverColor={props.hoverColor}
      $activeColor={props.activeColor}
    />
  );
};

export class ReactorExpandNodeFactory extends WorkspaceNodeFactory<ReactorWorkspaceNodeModel> {
  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  protected _generateModel() {
    return new ReactorWorkspaceNodeModel();
  }

  generateContent(event: WorkspaceModelFactoryEvent<ReactorWorkspaceNodeModel>): React.JSX.Element {
    return (
      <ExpandNodeWidget
        generateDivider={(container) => {
          const currentTheme = this.themeStore.getCurrentTheme(theme);

          return (
            <ReactorDividerWidget
              engine={event.engine}
              dimensionContainer={container}
              hoverColor={currentTheme.workspace.overlayDividerHover}
              activeColor={currentTheme.workspace.overlayDividerHover}
            />
          );
        }}
        model={event.model}
        engine={event.engine}
        factory={this}
      />
    );
  }
}

namespace S {
  export const Divider = styled.div<{
    $hover: boolean;
    $active: boolean;
    $hoverColor: string;
    $activeColor: string;
  }>`
    min-width: ${WORKSPACE_PANEL_INSET}px;
    min-height: ${WORKSPACE_PANEL_INSET}px;
    transition: background 0.2s;
    transition-delay: 50ms;
    ${(p) => (p.$hover ? `background: ${p.$hoverColor}` : '')};
    ${(p) => (p.$active ? `background: ${p.$activeColor}` : '')};
  `;
}
