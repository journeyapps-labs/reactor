import * as React from 'react';

import { PanelCategory } from '../../definitions/common';
import { SettingsPanelWidget } from './SettingsPanelWidget';
import { ReactorPanelFactory } from '../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';
import { WorkspaceEngineInterface, WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { makeObservable, observable } from 'mobx';

export class SettingsPanelModel extends ReactorPanelModel {
  @observable
  accessor selectedTab: string;

  constructor() {
    super(SettingsPanelFactory.TYPE);
    this.setExpand(true, true);
    this.selectedTab = null;
  }

  toArray() {
    return {
      ...super.toArray(),
      selectedTab: this.selectedTab
    };
  }

  fromArray(payload: ReturnType<this['toArray']>, engine: WorkspaceEngineInterface) {
    super.fromArray(payload, engine);
    this.selectedTab = payload.selectedTab;
  }
}

export class SettingsPanelFactory extends ReactorPanelFactory<SettingsPanelModel> {
  static TYPE = 'settings';

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
