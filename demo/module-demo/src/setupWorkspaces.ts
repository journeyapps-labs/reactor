import { ReactorEntities, SettingsPanelModel, System, WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { ioc } from '@journeyapps-labs/reactor-mod';
import { DemoEntities } from './DemoEntities';
import { DemoFormsDialogsPanelModel } from './panels/DemoFormsDialogsPanelFactory';
import { DemoEditorsPanelModel } from './panels/DemoEditorsPanelFactory';

export const setupWorkspaces = () => {
  const workspaceStore = ioc.get(WorkspaceStore);
  const system = ioc.get(System);

  const generateSimpleWorkspace = () => {
    let model = workspaceStore.generateRootModel();

    model.addModel(
      system.getDefinition(DemoEntities.TODO_ITEM).getPanelComponents()[0].generatePanelFactory().generateModel()
    );

    return model;
  };

  const generateComplexWorkspace = () => {
    let model = workspaceStore.generateRootModel();

    //put actions panel in a tray
    model.addModel(
      workspaceStore.engine
        .generateReactorTrayModel()
        .addModel(
          system.getDefinition(ReactorEntities.ACTION).getPanelComponents()[0].generatePanelFactory().generateModel()
        )
    );

    // put settings panel in tabs
    model.addModel(workspaceStore.engine.generateReactorTabModel().addModel(new SettingsPanelModel()));

    // put actions panel simply on the side without a container
    model.addModel(
      system.getDefinition(ReactorEntities.PANEL).getPanelComponents()[0].generatePanelFactory().generateModel()
    );
    return model;
  };

  const generateFormsWorkspace = () => {
    let model = workspaceStore.generateRootModel();
    model.addModel(new DemoFormsDialogsPanelModel());
    return model;
  };

  const generateEditorsWorkspace = () => {
    let model = workspaceStore.generateRootModel();
    model.addModel(new DemoEditorsPanelModel());
    return model;
  };

  workspaceStore.registerWorkspaceGenerator({
    generateAdvancedWorkspace: async () => {
      return {
        name: 'Simple workspace',
        priority: 1,
        model: generateSimpleWorkspace()
      };
    },
    generateSimpleWorkspace: async () => {
      return {
        name: 'Simple workspace',
        priority: 1,
        model: generateSimpleWorkspace()
      };
    }
  });

  workspaceStore.registerWorkspaceGenerator({
    generateAdvancedWorkspace: async () => {
      return {
        name: 'Complex workspace',
        priority: 1,
        model: generateComplexWorkspace()
      };
    },
    generateSimpleWorkspace: async () => {
      return {
        name: 'Complex workspace',
        priority: 1,
        model: generateComplexWorkspace()
      };
    }
  });

  workspaceStore.registerWorkspaceGenerator({
    generateAdvancedWorkspace: async () => {
      return {
        name: 'Forms & dialogs workspace',
        priority: 1,
        model: generateFormsWorkspace()
      };
    },
    generateSimpleWorkspace: async () => {
      return {
        name: 'Forms & dialogs workspace',
        priority: 1,
        model: generateFormsWorkspace()
      };
    }
  });

  workspaceStore.registerWorkspaceGenerator({
    generateAdvancedWorkspace: async () => {
      return {
        name: 'Editors workspace',
        priority: 1,
        model: generateEditorsWorkspace()
      };
    },
    generateSimpleWorkspace: async () => {
      return {
        name: 'Editors workspace',
        priority: 1,
        model: generateEditorsWorkspace()
      };
    }
  });
};
