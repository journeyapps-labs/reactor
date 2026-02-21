import * as React from 'react';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { EmptyWorkspacePanel } from './EmptyWorkspacePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { TabRendererEvent } from '@projectstorm/react-workspaces-model-tabs';
import { TAB_BAR_HEIGHT } from '../../stores/workspace/react-workspaces/ReactorTabFactory';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { EMPTY_REACTOR_PANEL_TYPE, EmptyReactorPanelModel } from './EmptyReactorPanelModel';

namespace S {
  export const Container = themed.div`
    background: ${(p) => p.theme.panels.trayBackground};
    display: flex;
    margin-right: 2px;
    align-items: center;
    padding: 0 10px;
    height: ${TAB_BAR_HEIGHT}px;
    overflow: hidden;
    cursor: pointer;
    color: white;
  `;
}

export class EmptyPanelWorkspaceFactory extends ReactorPanelFactory<EmptyReactorPanelModel> {
  static TYPE = EMPTY_REACTOR_PANEL_TYPE;

  constructor() {
    super({
      type: EmptyPanelWorkspaceFactory.TYPE,
      name: 'Select panel',
      icon: 'clone',
      allowManualCreation: false,
      isMultiple: false
    });
  }

  protected _generateModel(): EmptyReactorPanelModel {
    return new EmptyReactorPanelModel();
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<EmptyReactorPanelModel>): React.JSX.Element {
    return <EmptyWorkspacePanel event={event} factory={this} />;
  }

  protected generatePanelTabInternal(event: TabRendererEvent<EmptyReactorPanelModel>): React.JSX.Element {
    return (
      <S.Container
        onClick={(e) => {
          e.persist();
          event.model.parent.delete();
        }}
      >
        <FontAwesomeIcon icon="times-circle" />
      </S.Container>
    );
  }
}
