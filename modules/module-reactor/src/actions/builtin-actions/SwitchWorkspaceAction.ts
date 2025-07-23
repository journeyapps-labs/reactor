import { IDEWorkspace, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { WorkspaceProvider } from '../../providers/WorkspaceProvider';
import { inject, ioc } from '../../inversify.config';
import { EntityAction, EntityActionEvent } from '../parameterized/EntityAction';
import { System } from '../../core/System';

export class SwitchWorkspaceAction extends EntityAction<IDEWorkspace> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  static NAME = 'Switch workspace';

  constructor() {
    super({
      id: 'SWITCH_WORKSPACE',
      name: SwitchWorkspaceAction.NAME,
      icon: 'th-large',
      target: WorkspaceProvider.NAME
    });
  }

  static get() {
    return ioc.get(System).getAction<SwitchWorkspaceAction>(SwitchWorkspaceAction.NAME);
  }

  protected async fireEvent(event: EntityActionEvent<IDEWorkspace>): Promise<any> {
    await this.workspaceStore.setActiveWorkspace(event.targetEntity.name);
  }
}
