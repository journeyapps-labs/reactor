import { Container } from '@journeyapps-labs/common-ioc';
import {
  AbstractReactorModule,
  ActionStore,
  System,
  UXStore,
  VisorStore,
  WorkspaceStore
} from '@journeyapps-labs/reactor-mod';
import { TodoStore } from './stores/TodoStore';
import { TodoModel } from './models/TodoModel';
import { TodoDefinition } from './entities/TodoDefinition';
import { CreateTodoAction } from './actions/CreateTodoAction';
import { DeleteTodoAction } from './actions/DeleteTodoAction';
import { CurrentTodoItemVisorMetadata } from './visor/CurrentTodoItemVisorMetadata';
import { SetCurrentTodoItemAction } from './actions/SetCurrentTodoItemAction';
import { AddSubTodoAction } from './actions/AddSubTodoAction';
import { DuplicateTodoAction } from './actions/DuplicateTodoAction';
import { RenameTodoAction } from './actions/RenameTodoAction';
import { TodoNoteDefinition } from './entities/TodoNoteDefinition';
import { AddTodoNoteAction } from './actions/AddTodoNoteAction';
import { EditTodoNoteAction } from './actions/EditTodoNoteAction';
import { DeleteTodoNoteAction } from './actions/DeleteTodoNoteAction';
import { TodoNoteModel } from './models/TodoNoteModel';
import { TodoEntities } from './TodoEntities';

export class ReactorTodosModule extends AbstractReactorModule {
  constructor() {
    super({
      name: 'Reactor todos module'
    });
  }

  register(ioc: Container) {
    const system = ioc.get(System);
    const visorStore = ioc.get(VisorStore);
    const actionStore = ioc.get(ActionStore);
    const workspaceStore = ioc.get(WorkspaceStore);

    ioc.bind(TodoStore).toConstantValue(new TodoStore());

    system.registerDefinition(new TodoDefinition());
    system.registerDefinition(new TodoNoteDefinition());

    actionStore.registerAction(new CreateTodoAction());
    actionStore.registerAction(new DeleteTodoAction());
    actionStore.registerAction(new SetCurrentTodoItemAction());
    actionStore.registerAction(new AddSubTodoAction());
    actionStore.registerAction(new AddTodoNoteAction());
    actionStore.registerAction(new EditTodoNoteAction());
    actionStore.registerAction(new DeleteTodoNoteAction());
    actionStore.registerAction(new RenameTodoAction());
    actionStore.registerAction(new DuplicateTodoAction());

    visorStore.registerActiveMetadata(new CurrentTodoItemVisorMetadata());

    const generateTodosWorkspace = () => {
      const model = workspaceStore.generateRootModel();
      model.addModel(
        system.getDefinition(TodoEntities.TODO_ITEM).getPanelComponents()[0].generatePanelFactory().generateModel()
      );
      return model;
    };

    workspaceStore.registerWorkspaceGenerator({
      generateAdvancedWorkspace: async () => {
        return {
          name: 'todos',
          priority: 1,
          model: generateTodosWorkspace()
        };
      },
      generateSimpleWorkspace: async () => {
        return {
          name: 'todos',
          priority: 1,
          model: generateTodosWorkspace()
        };
      }
    });
  }

  async init(ioc: Container): Promise<any> {
    const uxStore = ioc.get<UXStore>(UXStore);
    const todoStore = ioc.get(TodoStore);
    uxStore.primaryLogo = require('../media/logo.png');

    const coffee = new TodoModel({
      name: 'Make some coffee',
      tags: ['home', 'morning', 'kitchen']
    });
    coffee.addNote(new TodoNoteModel('Try medium roast next time'));
    coffee.addNote(new TodoNoteModel('Use filtered water for better taste'));
    coffee.addChild(
      new TodoModel({
        name: 'Boil water',
        tags: ['prep', 'kitchen']
      })
    );
    coffee.addChild(
      new TodoModel({
        name: 'Grind beans',
        tags: ['prep']
      })
    );
    coffee.addChild(
      new TodoModel({
        name: 'Brew and serve',
        tags: ['serve']
      })
    );

    const eggs = new TodoModel({
      name: 'Fry some eggs',
      tags: ['home', 'breakfast', 'kitchen']
    });
    eggs.addNote(new TodoNoteModel('Use butter instead of oil'));
    eggs.addChild(
      new TodoModel({
        name: 'Heat pan',
        tags: ['prep']
      })
    );
    eggs.addChild(
      new TodoModel({
        name: 'Crack eggs',
        tags: ['prep']
      })
    );

    todoStore.addTodo(coffee);
    todoStore.addTodo(eggs);
    todoStore.addTodo(
      new TodoModel({
        name: 'Check the oil in the car',
        tags: ['errands', 'maintenance']
      })
    );
  }
}
