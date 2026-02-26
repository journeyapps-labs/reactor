import { WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { ioc } from '@journeyapps-labs/reactor-mod';
import { PlaygroundPanelModel } from './panels/PlaygroundPanelFactory';

export const setupWorkspaces = () => {
  const workspaceStore = ioc.get(WorkspaceStore);

  const generatePlaygroundWorkspace = () => {
    const model = workspaceStore.generateRootModel();

    model.addModel(
      workspaceStore.engine
        .generateReactorTabModel()
        .addModel(new PlaygroundPanelModel('playground.dialogs-comboboxes'))
        .addModel(new PlaygroundPanelModel('playground.tree-search'))
        .addModel(new PlaygroundPanelModel('playground.forms'))
        .addModel(new PlaygroundPanelModel('playground.cards'))
        .addModel(new PlaygroundPanelModel('playground.buttons'))
        .addModel(new PlaygroundPanelModel('playground.editors'))
    );

    return model;
  };

  workspaceStore.registerWorkspaceGenerator({
    generateAdvancedWorkspace: async () => {
      return {
        name: 'playground',
        priority: 1,
        model: generatePlaygroundWorkspace()
      };
    },
    generateSimpleWorkspace: async () => {
      return {
        name: 'playground',
        priority: 1,
        model: generatePlaygroundWorkspace()
      };
    }
  });
};
