import * as React from 'react';
import { PanelTitleWidget } from './title/PanelTitleWidget';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { FloatingWindowModel } from '@projectstorm/react-workspaces-model-floating-window';
import { ioc } from '../../../inversify.config';
import { observer } from 'mobx-react';
import { Btn } from '../../../definitions/common';
import { AdvancedWorkspacePreference } from '../../../preferences/AdvancedWorkspacePreference';
import { ReactorIcon } from '../../icons/IconWidget';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { WorkspaceStore } from '../../../stores';
import { ReactorWindowModel } from '../../../stores/workspace/react-workspaces/ReactorWindowFactory';
import { System } from '../../../core/System';
import { ReactorEntities } from '../../../entities-reactor/ReactorEntities';

export interface SmartPanelTitleWidgetProps {
  event: WorkspaceModelFactoryEvent<ReactorPanelModel>;
  icon: ReactorIcon;
  icon2: ReactorIcon;
  color: string;
  name: string;
  btns?: (Btn & { highlight?: boolean })[];
  fullscreen?: boolean;
  factory: ReactorPanelFactory;
}

@observer
export class SmartPanelTitleWidget extends React.Component<SmartPanelTitleWidgetProps> {
  getCloseButton(): Btn {
    if (this.props.event.model.parent instanceof FloatingWindowModel) {
      return {
        icon: 'times',
        tooltip: 'Close window',
        action: () => {
          this.props.event.model.parent.delete();
        }
      };
    }

    return {
      icon: 'times',
      tooltip: 'Close panel',
      action: () => {
        this.props.event.model.delete();
      }
    };
  }

  getButtons() {
    if (this.props.event.model.parent instanceof ReactorWindowModel) {
      if (this.props.event.model.parent.standalone) {
        return [...(this.props.btns || []), this.getCloseButton()];
      }
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
        btns.push(this.getCloseButton());
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
