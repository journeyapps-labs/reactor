import { EntityAction, EntityActionEvent } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { TodoEntities } from '../TodoEntities';
import { setupDeleteConfirmation } from '@journeyapps-labs/reactor-mod';

export class DeleteTodoAction extends EntityAction<TodoModel> {
  constructor() {
    super({
      id: 'DELETE_TODO',
      name: 'Delete todo item',
      icon: 'trash',
      target: TodoEntities.TODO_ITEM,
      category: {
        grouping: 'danger'
      }
    });
    setupDeleteConfirmation({
      action: this
    });
  }

  async fireEvent(event: EntityActionEvent<TodoModel>): Promise<any> {
    event.targetEntity.delete();
  }
}
