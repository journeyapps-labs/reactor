import { EntityAction, EntityActionEvent, ioc, System } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { DemoEntities } from '../DemoEntities';

export class SetCurrentTodoItemAction extends EntityAction<TodoModel> {
  static ID = 'SET_CURRENT_TODO';

  constructor() {
    super({
      id: SetCurrentTodoItemAction.ID,
      name: 'Set current todo item',
      icon: 'arrow-right',
      target: DemoEntities.TODO_ITEM
    });
  }

  async fireEvent(event: EntityActionEvent<TodoModel>): Promise<any> {
    event.targetEntity.makeActive();
  }

  static get() {
    return ioc.get(System).getActionByID<SetCurrentTodoItemAction>(SetCurrentTodoItemAction.ID);
  }
}
