import { EntityAction, EntityActionEvent } from '@journeyapps-labs/reactor-mod';
import { TodoModel } from '../models/TodoModel';
import { DemoEntities } from '../DemoEntities';

export class RenameTodoAction extends EntityAction<TodoModel> {
  static ID = 'RENAME_TODO';

  constructor() {
    super({
      id: RenameTodoAction.ID,
      name: 'Rename todo',
      icon: 'pencil',
      target: DemoEntities.TODO_ITEM,
      category: {
        grouping: 'edit'
      }
    });
  }

  async fireEvent(event: EntityActionEvent<TodoModel>): Promise<any> {
    const result = await this.dialogStore.showInputDialog({
      title: 'Rename todo',
      initialValue: event.targetEntity.name
    });

    const nextName = result?.trim();
    if (!nextName) {
      return false;
    }

    event.targetEntity.name = nextName;
  }
}
