import { Container } from '@journeyapps-labs/common-ioc';
import { AbstractReactorModule, RawBodyWidget, UXStore, WorkspaceStore } from '@journeyapps-labs/reactor-mod';

export class ReactorCustomLayout extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor custom layout'
    });
  }

  register(ioc: Container) {
    const workspaceStore = ioc.get(WorkspaceStore);
    workspaceStore.registerWorkspaceGenerator({
      generateAdvancedWorkspace: async () => {
        return {
          name: 'Advanced workspace',
          priority: 1,
          model: workspaceStore.generateRootModel()
        };
      },
      generateSimpleWorkspace: async () => {
        return {
          name: 'Simple workspace',
          priority: 1,
          model: workspaceStore.generateRootModel()
        };
      }
    });
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(RawBodyWidget);
  }
}
