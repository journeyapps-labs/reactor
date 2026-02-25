import { WorkspaceEngineInterface } from '@projectstorm/react-workspaces-core';
import { observable } from 'mobx';
import { ReactorPanelModel } from '../../stores/workspace/react-workspaces/ReactorPanelModel';

export const SETTINGS_PANEL_TYPE = 'settings';

export class SettingsPanelModel extends ReactorPanelModel {
  @observable
  accessor selectedTab: string;

  constructor() {
    super(SETTINGS_PANEL_TYPE);
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
