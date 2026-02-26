import { ActionStore, EntityAction, EntityActionEvent, ioc } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { TodoEntities } from '../TodoEntities';

export class SetCurrentTodoItemAction extends EntityAction<TodoModel> {
  static ID = 'SET_CURRENT_TODO';

  constructor() {
    super({
      id: SetCurrentTodoItemAction.ID,
      name: 'Set current todo item',
      icon: 'arrow-right',
      target: TodoEntities.TODO_ITEM,
      category: {
        grouping: 'state'
      }
    });
  }

  async fireEvent(event: EntityActionEvent<TodoModel>): Promise<any> {
    event.targetEntity.makeActive();
  }

  static get() {
    return ioc.get(ActionStore).getActionByID<SetCurrentTodoItemAction>(SetCurrentTodoItemAction.ID);
  }
}
