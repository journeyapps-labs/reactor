import { ioc, inject } from '../../../inversify.config';
import React from 'react';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { Action, ActionEvent } from '../../Action';
import { setupDeleteConfirmation } from '../../action-utils';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class ResetShortcutsAction extends Action {
  @inject(ShortcutStore)
  accessor shortcutStore: ShortcutStore;

  static NAME = 'Reset shortcuts';

  constructor() {
    super({
      id: 'RESET_SHORTCUTS',
      name: ResetShortcutsAction.NAME,
      icon: 'sync-alt'
    });
    setupDeleteConfirmation({
      action: this
    });
  }

  static get(): ResetShortcutsAction {
    return ioc.get(ActionStore).getAction(ResetShortcutsAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    await this.shortcutStore.reset();
  }
}
