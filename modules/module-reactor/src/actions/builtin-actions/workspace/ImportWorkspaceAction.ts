import { Action, ActionEvent } from '../../Action';
import { inject, ioc } from '../../../inversify.config';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { NotificationStore } from '../../../stores/NotificationStore';
import { WorkspaceActionValidator } from './WorkspaceActionValidator';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class ImportWorkspaceAction extends Action {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  static NAME = 'Import workspace(s)';

  constructor() {
    super({
      id: 'IMPORT_WORKSPACE',
      name: ImportWorkspaceAction.NAME,
      icon: 'download',
      validators: [new WorkspaceActionValidator()]
    });
  }

  static get(): ImportWorkspaceAction {
    return ioc.get(ActionStore).getAction(ImportWorkspaceAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    if (await this.workspaceStore.importWorkspace()) {
      this.notificationStore.showNotification({
        title: 'Success',
        description: 'Your workspaces have been imported'
      });
    }
  }
}
