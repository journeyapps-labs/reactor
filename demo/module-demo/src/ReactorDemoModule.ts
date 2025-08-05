import { Container } from '@journeyapps-labs/common-ioc';
import {
  AbstractReactorModule,
  EmptyReactorPanelModel,
  ReactorEntities,
  SettingsPanelModel,
  System,
  UXStore,
  WorkspaceStore
} from '@journeyapps-labs/reactor-mod';
import { DemoBodyWidget } from './BodyWidget';

export class ReactorDemoModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor demo module'
    });
  }

  register(ioc: Container) {
    const workspaceStore = ioc.get(WorkspaceStore);

    const generateSimpleWorkspace = () => {
      let model = workspaceStore.generateRootModel();

      model.addModel(new EmptyReactorPanelModel());

      return model;
    };

    const generateComplexWorkspace = () => {
      let model = workspaceStore.generateRootModel();

      //put actions panel in a tray
      model.addModel(
        workspaceStore.engine
          .generateReactorTrayModel()
          .addModel(
            ioc
              .get(System)
              .getDefinition(ReactorEntities.ACTION)
              .getPanelComponents()[0]
              .generatePanelFactory()
              .generateModel()
          )
      );

      // put settings panel in tabs
      model.addModel(workspaceStore.engine.generateReactorTabModel().addModel(new SettingsPanelModel()));

      // put actions panel simply on the side without a container
      model.addModel(
        ioc
          .get(System)
          .getDefinition(ReactorEntities.PANEL)
          .getPanelComponents()[0]
          .generatePanelFactory()
          .generateModel()
      );
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
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(DemoBodyWidget);
    uxStore.primaryLogo = require('../media/logo.png');
  }
}
