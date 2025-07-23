import * as React from 'react';
import { WorkspaceNodeModel, WorkspaceWidget } from '@projectstorm/react-workspaces-core';
import { inject } from '../../inversify.config';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { System } from '../../core/System';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { UXStore } from '../../stores/UXStore';
import { AwSnapWidget } from '../panel/panel/AwSnapWidget';

namespace S {
  export const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
  `;
}

export interface SmartWorkspaceWidgetProps {
  forwardRef: React.RefObject<HTMLDivElement>;
}

export interface SmartWorkspaceWidgetState {
  error: boolean;
}

@observer
export class SmartWorkspaceWidget extends React.Component<SmartWorkspaceWidgetProps, SmartWorkspaceWidgetState> {
  model: WorkspaceNodeModel;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(UXStore)
  accessor uxStore: UXStore;

  @inject(System)
  accessor app: System;

  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error: true
    });
  }

  getWorkspace() {
    if (this.state.error) {
      return <AwSnapWidget />;
    }
    if (!this.workspaceStore.getRoot()) {
      return null;
    }

    return (
      <WorkspaceWidget
        engine={this.workspaceStore.engine}
        model={this.workspaceStore.fullscreenModel || this.workspaceStore.getRoot()}
      />
    );
  }

  render() {
    return <S.Container ref={this.props.forwardRef}>{this.getWorkspace()}</S.Container>;
  }
}
