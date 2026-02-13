import { Container } from '@journeyapps-labs/common-ioc';
import { AbstractReactorModule, System, UXStore, VisorStore, WorkspaceStore } from '@journeyapps-labs/reactor-mod';
import { DemoBodyWidget } from './BodyWidget';
import { setupWorkspaces } from './setupWorkspaces';
import { TodoStore } from './stores/TodoStore';
import { TodoModel } from './models/TodoModel';
import { TodoDefinition } from './entities/TodoDefinition';
import { CreateTodoAction } from './actions/CreateTodoAction';
import { DeleteTodoAction } from './actions/DeleteTodoAction';
import { CurrentTodoItemVisorMetadata } from './visor/CurrentTodoItemVisorMetadata';
import { SetCurrentTodoItemAction } from './actions/SetCurrentTodoItemAction';
import { ShowDemoFormAction } from './actions/ShowDemoFormAction';
import { DemoFormsDialogsPanelFactory } from './panels/DemoFormsDialogsPanelFactory';

export class ReactorDemoModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor demo module'
    });
  }

  register(ioc: Container) {
    const system = ioc.get(System);
    const visorStore = ioc.get(VisorStore);
    const workspaceStore = ioc.get(WorkspaceStore);

    ioc.bind(TodoStore).toConstantValue(new TodoStore());

    system.registerDefinition(new TodoDefinition());

    system.registerAction(new CreateTodoAction());
    system.registerAction(new DeleteTodoAction());
    system.registerAction(new SetCurrentTodoItemAction());
    system.registerAction(new ShowDemoFormAction());
    workspaceStore.registerFactory(new DemoFormsDialogsPanelFactory());

    visorStore.registerActiveMetadata(new CurrentTodoItemVisorMetadata());

    setupWorkspaces();
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    uxStore.setRootComponent(DemoBodyWidget);
    uxStore.primaryLogo = require('../media/logo.png');

    ioc.get(TodoStore).addTodo(new TodoModel('Make some coffee'));
    ioc.get(TodoStore).addTodo(new TodoModel('Fry some eggs'));
    ioc.get(TodoStore).addTodo(new TodoModel('Check the oil in the car'));
  }
}
