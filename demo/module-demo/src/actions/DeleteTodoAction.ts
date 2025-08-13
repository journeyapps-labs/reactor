import { EntityAction, EntityActionEvent } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { DemoEntities } from '../DemoEntities';
import { setupDeleteConfirmation } from '@journeyapps-labs/reactor-mod';

export class DeleteTodoAction extends EntityAction<TodoModel> {
  constructor() {
    super({
      id: 'DELETE_TODO',
      name: 'Delete todo item',
      icon: 'trash',
      target: DemoEntities.TODO_ITEM
    });
    setupDeleteConfirmation({
      action: this
    });
  }

  async fireEvent(event: EntityActionEvent<TodoModel>): Promise<any> {
    event.targetEntity.delete();
  }
}
