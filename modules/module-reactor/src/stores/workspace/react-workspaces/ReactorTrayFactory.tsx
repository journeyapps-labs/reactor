import { WorkspaceTrayFactory, WorkspaceTrayMode, WorkspaceTrayModel } from '@projectstorm/react-workspaces-model-tray';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { AdvancedWorkspacePreference } from '../../../preferences/AdvancedWorkspacePreference';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { SmartTrayTitleWidget } from '../../../widgets/panel/tray/SmartTrayTitleWidget';
import { FloatingWindowFactory } from '@projectstorm/react-workspaces-model-floating-window';
import { styled } from '../../themes/reactor-theme-fragment';

namespace S {
  export const Pin = styled.div`
    color: ${(p) => getTransparentColor(p.theme.panels.titleForeground, 0.5)};
    cursor: pointer;
    font-size: 13px;
    height: 20px;
    width: 20px;
    margin: auto;
    margin-bottom: 3px;
    margin-top: 5px;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;

    &:hover {
      color: ${(p) => p.theme.panels.titleForeground};
    }
  `;
}

export class ReactorTrayModel extends WorkspaceTrayModel {
  constructor(factory: FloatingWindowFactory) {
    super({
      iconWidth: 30,
      factory: factory
    });
    this.setExpand(false, true);
  }
}

export class ReactorTrayFactory extends WorkspaceTrayFactory<ReactorTrayModel> {
  protected _generateModel() {
    return new ReactorTrayModel(this.options.windowFactory);
  }

  generateTrayHeader(event: WorkspaceModelFactoryEvent<WorkspaceTrayModel>): any {
    if (event.model.mode === WorkspaceTrayMode.COLLAPSED) {
      // micro button should be hidden in simple mode
      if (!AdvancedWorkspacePreference.enabled()) {
        return null;
      }
      return (
        <S.Pin
          onClick={() => {
            event.model.setMode(WorkspaceTrayMode.NORMAL);
          }}
        >
          <FontAwesomeIcon icon="expand" />
        </S.Pin>
      );
    }
    return <SmartTrayTitleWidget engine={event.engine} model={event.model} />;
  }
}
