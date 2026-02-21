import * as React from 'react';

import { PanelCategory } from '../../definitions/common';
import { SettingsPanelWidget } from './SettingsPanelWidget';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { SETTINGS_PANEL_TYPE, SettingsPanelModel } from './SettingsPanelModel';

export class SettingsPanelFactory extends ReactorPanelFactory<SettingsPanelModel> {
  static TYPE = SETTINGS_PANEL_TYPE;

  constructor() {
    super({
      type: SettingsPanelFactory.TYPE,
      icon: 'cog',
      name: 'IDE settings',
      category: PanelCategory.IDE,
      isMultiple: false
    });
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<SettingsPanelModel>): React.JSX.Element {
    return <SettingsPanelWidget model={event.model} />;
  }

  protected _generateModel() {
    return new SettingsPanelModel();
  }
}
