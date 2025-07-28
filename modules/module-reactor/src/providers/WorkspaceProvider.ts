import { SimpleProvider } from './SimpleProvider';
import { SerializedEntity } from './Provider';
import { IDEWorkspace, WorkspaceStore } from '../stores/workspace/WorkspaceStore';
import { ioc, inject } from '../inversify.config';
import * as _ from 'lodash';
import { System } from '../core/System';
import { SwitchWorkspaceAction } from '../actions/builtin-actions/SwitchWorkspaceAction';
import { ActionSource } from '../actions/Action';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';

export interface WorkspaceNodeModelSerialized extends SerializedEntity {
  id: string;
}

export class WorkspaceProvider extends SimpleProvider<IDEWorkspace, WorkspaceNodeModelSerialized> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  static NAME = 'workspace';

  constructor() {
    super({
      displayName: 'Workspaces',
      icon: 'th-large',
      type: WorkspaceProvider.NAME
    });
  }

  async deserialize(entity: WorkspaceNodeModelSerialized): Promise<IDEWorkspace> {
    return this.workspaceStore.getIDEWorkspace(entity.id);
  }

  serialize(entity: IDEWorkspace): WorkspaceNodeModelSerialized {
    return {
      ...super.serialize(entity),
      display: entity.name,
      id: entity.model.id
    };
  }

  async getEntities(search: SearchEvent): Promise<IDEWorkspace[]> {
    return _.filter(this.workspaceStore.workspaces, (workspace) => {
      return !!search.matches(workspace.name);
    });
  }

  openEntity(entity: IDEWorkspace) {
    ioc.get(System).getAction<SwitchWorkspaceAction>(SwitchWorkspaceAction.NAME).fireAction({
      source: ActionSource.COMMAND_PALLET,
      targetEntity: entity
    });
  }
}
