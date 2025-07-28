import * as React from 'react';
import { WorkspaceEngine } from '@projectstorm/react-workspaces-core';
import { WorkspaceTrayMode, WorkspaceTrayModel } from '@projectstorm/react-workspaces-model-tray';
import { Btn } from '../../../definitions/common';
import { AdvancedWorkspacePreference } from '../../../preferences/AdvancedWorkspacePreference';
import { observer } from 'mobx-react';
import { TrayTitleWidget } from './TrayTitleWidget';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../../stores/workspace/react-workspaces/ReactorPanelModel';

export interface SmartTrayTitleWidgetProps {
  model: WorkspaceTrayModel;
  engine: WorkspaceEngine;
}

@observer
export class SmartTrayTitleWidget extends React.Component<SmartTrayTitleWidgetProps> {
  private listener: () => void;

  getMinimizeButtons(): Btn[] {
    if (this.props.model.mode === WorkspaceTrayMode.NORMAL) {
      return [
        {
          icon: 'window-minimize',
          action: () => {
            this.props.model.setMode(WorkspaceTrayMode.COLLAPSED);
          }
        }
      ];
    }
    return [
      {
        icon: 'window-maximize',
        action: () => {
          this.props.model.setMode(WorkspaceTrayMode.NORMAL);
        }
      }
    ];
  }

  componentWillUnmount() {
    this.listener?.();
  }

  componentDidMount() {
    this.listener = this.props.model.registerListener({
      selectionChanged: () => {
        this.forceUpdate();
      }
    });
  }

  getOtherButtons() {
    if (this.props.model.mode === WorkspaceTrayMode.NORMAL) {
      const selected = this.props.model.getSelectedModel();
      if (selected && selected instanceof ReactorPanelModel) {
        const factory = this.props.engine.getFactory<ReactorPanelFactory>(selected);
        return factory.getAdditionalButtons({
          model: selected,
          engine: this.props.engine
        });
      }
    }
    return [];
  }

  getCloseButton(): Btn {
    return {
      icon: 'times',
      action: () => {
        this.props.model.delete();
      }
    };
  }

  render() {
    if (!AdvancedWorkspacePreference.enabled()) {
      return null;
    }
    return (
      <TrayTitleWidget
        collapse={() => {
          this.props.model.setMode(WorkspaceTrayMode.COLLAPSED);
        }}
        btns={[...this.getOtherButtons(), ...this.getMinimizeButtons(), this.getCloseButton()]}
      />
    );
  }
}
