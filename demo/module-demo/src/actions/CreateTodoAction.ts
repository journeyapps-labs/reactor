import { Action, ActionEvent, inject, ioc, System } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { TodoStore } from '../stores/TodoStore';

export class CreateTodoAction extends Action {
  @inject(TodoStore)
  accessor todoStore: TodoStore;

  static ID = 'CREATE_TODO';

  constructor() {
    super({
      id: CreateTodoAction.ID,
      name: 'Create todo item',
      icon: 'plus'
    });
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    // show a loader
    event.getStatus().pushMessage('Creating an inpuit');
    let result = await this.dialogStore.showInputDialog({
      title: 'Create todo'
    });
    if (!result) {
      return false;
    }

    this.todoStore.addTodo(new TodoModel(result));
  }

  static get() {
    return ioc.get(System).getActionByID<CreateTodoAction>(CreateTodoAction.ID);
  }
}
