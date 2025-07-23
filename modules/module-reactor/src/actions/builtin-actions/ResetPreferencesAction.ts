import { Action, ActionEvent } from '../Action';
import { inject } from '../../inversify.config';
import { PrefsStore } from '../../stores/PrefsStore';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { setupDeleteConfirmation } from '../action-utils';

export class ResetPreferencesAction extends Action {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor() {
    super({
      id: 'RESET_PREFERENCES',
      name: 'Reset preferences',
      icon: 'sync'
    });
    setupDeleteConfirmation({
      action: this
    });
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    await this.prefsStore.reset();
    const reset = await this.dialogStore.showConfirmDialog({
      title: 'Also reset workspaces?',
      message: 'Select yes to clear workspaces in addition to the settings',
      noBtn: {
        label: 'no'
      },
      yesBtn: {
        label: 'yes'
      }
    });
    if (reset) {
      await this.workspaceStore.reset();
    }
  }
}
