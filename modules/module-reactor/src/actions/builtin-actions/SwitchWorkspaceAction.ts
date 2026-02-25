import { IDEWorkspace, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { inject, ioc } from '../../inversify.config';
import { EntityAction, EntityActionEvent } from '../parameterized/EntityAction';
import { ReactorEntities } from '../../entities-reactor/ReactorEntities';
import { ActionStore } from '../../stores/actions/ActionStore';

export class SwitchWorkspaceAction extends EntityAction<IDEWorkspace> {
  static ID = 'SWITCH_WORKSPACE';

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  static NAME = 'Switch workspace';

  constructor() {
    super({
      id: SwitchWorkspaceAction.ID,
      name: SwitchWorkspaceAction.NAME,
      icon: 'th-large',
      target: ReactorEntities.WORKSPACE
    });
  }

  static get() {
    return ioc.get(ActionStore).getAction<SwitchWorkspaceAction>(SwitchWorkspaceAction.NAME);
  }

  protected async fireEvent(event: EntityActionEvent<IDEWorkspace>): Promise<any> {
    await this.workspaceStore.setActiveWorkspace(event.targetEntity.name);
  }
}
