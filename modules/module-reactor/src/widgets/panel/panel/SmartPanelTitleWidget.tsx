import * as React from 'react';
import { PanelTitleWidget } from './title/PanelTitleWidget';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { FloatingWindowModel } from '@projectstorm/react-workspaces-model-floating-window';
import { ReactorWindowModel } from '../../../stores/workspace/react-workspaces/ReactorWindowFactory';
import { ioc } from '../../../inversify.config';
import { observer } from 'mobx-react';
import { Btn } from '../../../definitions/common';
import { AdvancedWorkspacePreference } from '../../../preferences/AdvancedWorkspacePreference';
import { ReactorIcon } from '../../icons/IconWidget';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { System } from '../../../core/System';
import { ReactorEntities } from '../../../entities-reactor/ReactorEntities';

export interface SmartPanelTitleWidgetProps {
  event: WorkspaceModelFactoryEvent<ReactorPanelModel>;
  icon: ReactorIcon;
  icon2: ReactorIcon;
  color: string;
  name: string;
  btns?: (Btn & { highlight?: boolean })[];
  factory: ReactorPanelFactory;
}

@observer
export class SmartPanelTitleWidget extends React.Component<SmartPanelTitleWidgetProps> {
  getCloseButton(): Btn {
    const workspaceStore = ioc.get(WorkspaceStore);
    if (this.props.event.model.parent instanceof FloatingWindowModel) {
      return {
        icon: 'times',
        tooltip: 'Close window',
        action: () => {
          this.props.event.model.parent.delete();
        }
      };
    }

    if (!workspaceStore.getActiveWorkspace()?.mutable) {
      return null;
    }

    return {
      icon: 'times',
      tooltip: 'Close panel',
      action: () => {
        this.props.event.model.delete();
      }
    };
  }

  getButtons(): (Btn & { highlight?: boolean })[] {
    if (this.props.event.model.parent instanceof FloatingWindowModel) {
      const window = this.props.event.model.parent as ReactorWindowModel;
      const btns: (Btn & { highlight?: boolean })[] = [...(this.props.btns || [])];
      btns.push({
        icon: window.maximized ? 'window-restore' : 'window-maximize',
        tooltip: window.maximized ? 'Restore window' : 'Maximize window',
        action: () => window.toggleMaximized()
      });
      const closeButton = this.getCloseButton();
      if (closeButton) btns.push(closeButton);
      return btns;
    }

    let btns: Btn[] = [].concat(this.props.btns || []);
    if (AdvancedWorkspacePreference.enabled()) {
      const workspaceStore = ioc.get(WorkspaceStore);
      const fullscreenButton = workspaceStore.generateFullscreenButton(this.props.event.model);
      btns.push({
        ...fullscreenButton,
        action: (event, loading) => {
          // also close the window if it came from there
          if (this.props.event.model.parent instanceof FloatingWindowModel) {
            this.props.event.model.parent.delete();
          }
          fullscreenButton.action(event, loading);
        }
      });

      if (!workspaceStore.fullscreenModel) {
        const closeButton = this.getCloseButton();
        if (closeButton) btns.push(closeButton);
      }
    }
    return btns;
  }

  render() {
    const describe = ioc
      .get(System)
      .getDefinition<ReactorPanelFactory>(ReactorEntities.PANEL)
      .describeEntity(this.props.factory);
    return (
      <PanelTitleWidget
        model={this.props.event.model}
        active={false}
        icon={this.props.icon}
        icon2={this.props.icon2}
        color={describe.iconColor}
        name={this.props.name}
        btns={this.getButtons()}
      />
    );
  }
}
