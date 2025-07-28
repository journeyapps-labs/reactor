import { inject, ioc } from '../../../inversify.config';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { System } from '../../../core/System';
import { ParameterizedAction, ParameterizedActionEvent } from '../../parameterized/ParameterizedAction';
import { TextActionParameter } from '../../parameterized/params/TextActionParameter';
import * as _ from 'lodash';
import { WorkspaceActionValidator } from './WorkspaceActionValidator';

export type CreateWorkspaceActionEvent = ParameterizedActionEvent<{ name: string }>;

export class CreateWorkspaceAction extends ParameterizedAction<{ EVENT: CreateWorkspaceActionEvent }> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  static NAME = 'Create workspace';

  constructor() {
    super({
      id: 'CREATE_WORKSPACE',
      name: CreateWorkspaceAction.NAME,
      icon: 'plus',
      validators: [new WorkspaceActionValidator()],
      params: [
        new TextActionParameter({
          name: 'name',
          label: 'Enter the name for this workspace'
        })
      ]
    });
  }

  static get() {
    return ioc.get(System).getAction<CreateWorkspaceAction>(CreateWorkspaceAction.NAME);
  }

  async fireEvent(event: CreateWorkspaceActionEvent): Promise<any> {
    await this.workspaceStore.newWorkspace(_.capitalize(event.entities.name));
  }
}
