import { Container } from '@journeyapps-labs/common-ioc';
import {
  AbstractReactorModule,
  RawBodyWidget,
  UXStore,
  WorkspaceModel,
  WorkspaceStore
} from '@journeyapps-labs/reactor-mod';

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
        return new WorkspaceModel({
          name: 'Advanced workspace',
          priority: 1,
          model: workspaceStore.generateRootModel()
        });
      },
      generateSimpleWorkspace: async () => {
        return new WorkspaceModel({
          name: 'Simple workspace',
          priority: 1,
          model: workspaceStore.generateRootModel()
        });
      }
    });
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(RawBodyWidget);
  }
}
