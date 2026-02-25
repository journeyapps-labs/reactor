import * as React from 'react';
import { PanelCategory, ReactorPanelFactory, ReactorPanelModel } from '@journeyapps-labs/reactor-mod';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import { DemoFormsDialogsPanelWidget } from './DemoFormsDialogsPanelWidget';

export class DemoFormsDialogsPanelModel extends ReactorPanelModel {
  constructor() {
    super(DemoFormsDialogsPanelFactory.TYPE);
    this.setExpand(true, true);
  }
}

export class DemoFormsDialogsPanelFactory extends ReactorPanelFactory<DemoFormsDialogsPanelModel> {
  static TYPE = 'demo.forms-dialogs';

  constructor() {
    super({
      type: DemoFormsDialogsPanelFactory.TYPE,
      icon: 'vial',
      name: 'Form & Dialog Lab',
      category: PanelCategory.IDE,
      isMultiple: true,
      padding: true
    });
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<DemoFormsDialogsPanelModel>): React.JSX.Element {
    return <DemoFormsDialogsPanelWidget model={event.model} />;
  }

  protected _generateModel(): DemoFormsDialogsPanelModel {
    return new DemoFormsDialogsPanelModel();
  }
}
