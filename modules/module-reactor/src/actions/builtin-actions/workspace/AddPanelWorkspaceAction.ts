import { ioc, inject } from '../../../inversify.config';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { EntityAction, EntityActionEvent } from '../../parameterized/EntityAction';
import { ReactorPanelFactory } from '../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ReactorEntities } from '../../../entities-reactor/ReactorEntities';
import { EntityActionParams } from '../../parameterized/ParameterizedAction';
import { ProviderActionParameter } from '../../parameterized/params/ProviderActionParameter';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class AddPanelWorkspaceAction extends EntityAction<ReactorPanelFactory> {
  static ID = 'ADD_WORKSPACE_PANEL';

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor() {
    super({
      id: AddPanelWorkspaceAction.ID,
      name: 'Add panel to workspace',
      icon: 'plus',
      target: ReactorEntities.PANEL
    });
    (
      this.options.params.find(
        (p) => p.options.name === EntityActionParams.TARGET
      ) as ProviderActionParameter<ReactorPanelFactory>
    ).options.filter = (entity) => {
      return entity.options.allowManualCreation;
    };
  }

  static get(): AddPanelWorkspaceAction {
    return ioc.get(ActionStore).getActionByID<AddPanelWorkspaceAction>(AddPanelWorkspaceAction.ID);
  }

  async fireEvent(event: EntityActionEvent<ReactorPanelFactory>): Promise<any> {
    this.workspaceStore.addModel(event.targetEntity.generateModel());
  }
}
