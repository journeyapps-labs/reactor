import { ioc, inject } from '../../../inversify.config';
import { System } from '../../../core/System';
import React from 'react';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { Action, ActionEvent } from '../../Action';
import { setupDeleteConfirmation } from '../../action-utils';

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
    return ioc.get(System).getAction(ResetShortcutsAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    await this.shortcutStore.reset();
  }
}
