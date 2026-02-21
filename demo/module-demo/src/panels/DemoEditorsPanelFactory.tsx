import * as React from 'react';
import { PanelCategory, ReactorPanelFactory, ReactorPanelModel } from '@journeyapps-labs/reactor-mod';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { DemoEditorsPanelWidget } from './DemoEditorsPanelWidget';

export class DemoEditorsPanelModel extends ReactorPanelModel {
  constructor() {
    super(DemoEditorsPanelFactory.TYPE);
    this.setExpand(true, true);
  }
}

export class DemoEditorsPanelFactory extends ReactorPanelFactory<DemoEditorsPanelModel> {
  static TYPE = 'demo.editors';

  constructor() {
    super({
      type: DemoEditorsPanelFactory.TYPE,
      icon: 'code',
      name: 'Editors playground',
      category: PanelCategory.IDE,
      isMultiple: true,
      padding: true
    });
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<DemoEditorsPanelModel>): React.JSX.Element {
    return <DemoEditorsPanelWidget model={event.model} />;
  }

  protected _generateModel(): DemoEditorsPanelModel {
    return new DemoEditorsPanelModel();
  }
}
