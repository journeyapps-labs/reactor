import * as React from 'react';
import {
  DividerWidget,
  ExpandNodeModel,
  WorkspaceModelFactoryEvent,
  WorkspaceNodeFactory,
  ExpandNodeWidget
} from '@projectstorm/react-workspaces-core';
import { ReactorPanelModel } from './ReactorPanelModel';
import { ThemeStore } from '../../themes/ThemeStore';
import { inject } from '../../../inversify.config';
import { theme } from '../../themes/reactor-theme-fragment';

export class ReactorWorkspaceNodeModel extends ExpandNodeModel {
  toArray() {
    const data = super.toArray();
    return {
      ...data,
      children: this.children
        .filter((child) => {
          // certain models we don't want to be serializable
          if (child instanceof ReactorPanelModel) {
            return child.isSerializable();
          }
          return true;
        })
        .map((m) => m.toArray())
    };
  }
}

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
            <DividerWidget
              engine={event.engine}
              dimensionContainer={container}
              thickness={4}
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
