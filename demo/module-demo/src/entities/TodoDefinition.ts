import {
  DescendantLoadingEntityProviderComponent,
  EntityCardsPresenterComponent,
  EntityActionHandlerComponent,
  EntityDefinition,
  EntityDescriberComponent,
  EntityPanelComponent,
  inject,
  InlineEntityEncoderComponent,
  InlineTreePresenterComponent,
  SimpleEntitySearchEngineComponent
} from '@journeyapps-labs/reactor-mod';
import { DemoEntities } from '../DemoEntities';
import { TodoStore } from '../stores/TodoStore';
import { TodoModel } from '../models/TodoModel';
import { CreateTodoAction } from '../actions/CreateTodoAction';
import { SetCurrentTodoItemAction } from '../actions/SetCurrentTodoItemAction';
import { AddSubTodoAction } from '../actions/AddSubTodoAction';

export class TodoDefinition extends EntityDefinition<TodoModel> {
  @inject(TodoStore)
  accessor todoStore: TodoStore;

  constructor() {
    super({
      type: DemoEntities.TODO_ITEM,
      category: 'Demo Items',
      label: 'Todo Item',
      icon: 'cube',
      iconColor: 'cyan'
    });

    // describe todos using the simple name (this is what is used in the tree presenter)
    this.registerComponent(
      new EntityDescriberComponent<TodoModel>({
        label: 'Simple',
        describe: (entity: TodoModel) => {
          let activeTask = this.todoStore.activeTodo === entity;

          return {
            simpleName: entity.name,
            iconColor: activeTask ? 'rgb(192,255,0)' : null,
            complexName: activeTask ? 'Active task' : null
          };
        }
      })
    );

    // provide todos to action parameter resolvers
    this.registerComponent(
      new SimpleEntitySearchEngineComponent<TodoModel>({
        label: 'Simple',
        getEntities: async () => {
          return this.todoStore.todos;
        }
      })
    );

    // allow the todos to be represented as tree items
    this.registerComponent(
      new InlineTreePresenterComponent<TodoModel>({
        augmentTreeNodeProps: () => {
          return {
            openOnSingleClick: false
          };
        }
      })
    );
    this.registerComponent(new EntityCardsPresenterComponent<TodoModel>());

    this.registerComponent(
      new InlineEntityEncoderComponent<TodoModel, { id: string }>({
        version: 1,
        encode: (entity) => {
          return { id: entity.id };
        },
        decode: async (encoded) => {
          return this.todoStore.todos.find((todo) => todo.id === encoded.id) || null;
        }
      })
    );

    // allow todos to expose nested sub todos to tree/card renderers
    this.registerComponent(
      new DescendantLoadingEntityProviderComponent<TodoModel, TodoModel>({
        descendantType: DemoEntities.TODO_ITEM,
        generateOptions: (todo) => {
          return {
            descendants: todo.children,
            refreshDescendants: () => {
              return null;
            }
          };
        }
      })
    );

    // by default let reactor set up a todos panel and use the tree presenter above
    this.registerComponent(
      new EntityPanelComponent<TodoModel>({
        label: 'Todos!',
        getEntities: () => {
          return this.todoStore.rootTodos;
        },
        additionalActions: [
          // add the create action as an additional right click item on the panel
          CreateTodoAction.ID,
          AddSubTodoAction.ID
        ]
      })
    );

    // selecting an item via the tree or cmd palette should make it the current todo item by default
    this.registerComponent(new EntityActionHandlerComponent(SetCurrentTodoItemAction.ID));
  }
  matchEntity(t: any): boolean {
    if (t instanceof TodoModel) {
      return true;
    }
  }

  getEntityUID(t: TodoModel) {
    return t.id;
  }
}
