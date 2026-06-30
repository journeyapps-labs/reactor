import { WorkspaceGroup, WorkspaceModel, WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { ioc } from '@journeyapps-labs/reactor-mod';
import { PlaygroundPanelModel } from './panels/PlaygroundPanelFactory';

export const setupWorkspaces = () => {
  const workspaceStore = ioc.get(WorkspaceStore);

  const generatePlaygroundWorkspace = (type: string) => {
    const model = workspaceStore.generateRootModel();

    model.addModel(new PlaygroundPanelModel(type));

    return model;
  };

  const generatePlaygroundWorkspaceGroup = () => {
    const playgroundWorkspaces = [
      ['playground.dialogs-comboboxes', 'Dialogs'],
      ['playground.tree-search', 'Tree search'],
      ['playground.forms', 'Forms'],
      ['playground.cards', 'Cards'],
      ['playground.buttons', 'Buttons'],
      ['playground.editors', 'Editors'],
      ['playground.tables', 'Tables'],
      ['playground.drag-drop', 'Drag drop']
    ];

    return new WorkspaceGroup({
      id: 'playground',
      name: 'playground',
      priority: 1,
      children: playgroundWorkspaces.map(([type, name]) => {
        return new WorkspaceModel({
          id: type,
          name,
          model: generatePlaygroundWorkspace(type)
        });
      })
    });
  };

  workspaceStore.registerWorkspaceGenerator({
    generateWorkspace: async () => {
      return generatePlaygroundWorkspaceGroup();
    }
  });
};
