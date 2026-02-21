import { Action, ActionEvent } from '../../Action';
import { inject, ioc } from '../../../inversify.config';
import { NotificationStore } from '../../../stores/NotificationStore';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class ImportShortcutsAction extends Action {
  @inject(ShortcutStore)
  accessor shortcutStore: ShortcutStore;

  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  static NAME = 'Import shortcuts';

  constructor() {
    super({
      id: 'IMPORT_SHORTCUTS',
      name: ImportShortcutsAction.NAME,
      icon: 'download'
    });
  }

  static get(): ImportShortcutsAction {
    return ioc.get(ActionStore).getAction(ImportShortcutsAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    if (await this.shortcutStore.importShortcuts()) {
      this.notificationStore.showNotification({
        title: 'Success',
        description: 'Your shortcuts have been imported'
      });
    }
  }
}
