import { Action, ActionEvent } from '../../Action';
import { inject, ioc } from '../../../inversify.config';
import { System } from '../../../core/System';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';

export class ResetWorkspacesAction extends Action {
  static NAME = 'Reset workspaces';

  constructor() {
    super({
      id: 'RESET_WORKSPACE',
      name: ResetWorkspacesAction.NAME,
      icon: 'sync'
    });
  }

  static get(): ResetWorkspacesAction {
    return ioc.get(System).getAction(ResetWorkspacesAction.NAME);
  }

  protected async fireEvent(event: ActionEvent): Promise<any> {
    await ioc.get(WorkspaceStore).reset();
  }
}
