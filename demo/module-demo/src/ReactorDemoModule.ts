import { Container } from '@journeyapps-labs/common-ioc';
import { AbstractReactorModule, EmptyReactorPanelModel, UXStore, WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { DemoBodyWidget } from './BodyWidget';

export class ReactorDemoModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor demo module'
    });
  }

  register(ioc: Container) {
    const workspaceStore = ioc.get(WorkspaceStore);

    const generateWorkspace = () => {
      let model = workspaceStore.generateRootModel();
      model.addModel(new EmptyReactorPanelModel());
      return model;
    };

    workspaceStore.registerWorkspaceGenerator({
      generateAdvancedWorkspace: async () => {
        return {
          name: 'Advanced workspace',
          priority: 1,
          model: generateWorkspace()
        };
      },
      generateSimpleWorkspace: async () => {
        return {
          name: 'Simple workspace',
          priority: 1,
          model: generateWorkspace()
        };
      }
    });
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(DemoBodyWidget);
    uxStore.primaryLogo = require('../media/logo.png');
  }
}
