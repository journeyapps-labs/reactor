import { EntityAction, EntityActionEvent } from '@journeyapps-labs/reactor-mod';
import { DemoEntities } from '../DemoEntities';
import { TodoNoteModel } from '../models/TodoNoteModel';

export class EditTodoNoteAction extends EntityAction<TodoNoteModel> {
  static ID = 'EDIT_TODO_NOTE';

  constructor() {
    super({
      id: EditTodoNoteAction.ID,
      name: 'Edit note',
      icon: 'pencil',
      target: DemoEntities.TODO_NOTE,
      category: {
        grouping: 'notes'
      }
    });
  }

  async fireEvent(event: EntityActionEvent<TodoNoteModel>): Promise<any> {
    const result = await this.dialogStore.showInputDialog({
      title: 'Edit note',
      initialValue: event.targetEntity.text
    });
    const next = result?.trim();
    if (!next) {
      return false;
    }
    event.targetEntity.text = next;
  }
}
