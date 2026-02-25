import { EntityAction, EntityActionEvent, inject } from '@journeyapps-labs/reactor-mod';
import { DemoEntities } from '../DemoEntities';
import { TodoNoteModel } from '../models/TodoNoteModel';
import { TodoStore } from '../stores/TodoStore';

export class DeleteTodoNoteAction extends EntityAction<TodoNoteModel> {
  static ID = 'DELETE_TODO_NOTE';

  @inject(TodoStore)
  accessor todoStore: TodoStore;

  constructor() {
    super({
      id: DeleteTodoNoteAction.ID,
      name: 'Remove note',
      icon: 'trash',
      target: DemoEntities.TODO_NOTE,
      category: {
        grouping: 'notes'
      }
    });
  }

  async fireEvent(event: EntityActionEvent<TodoNoteModel>): Promise<any> {
    this.todoStore.removeNote(event.targetEntity);
  }
}
