import { inject, ioc } from '../../../inversify.config';
import { WorkspaceStore, IDEWorkspace } from '../../../stores/workspace/WorkspaceStore';
import React from 'react';
import { DownloadWorkspaceIcon } from './ExportWorkspacesAction';
import { EntityAction, EntityActionEvent } from '../../parameterized/EntityAction';
import { ReactorEntities } from '../../../entities-reactor/ReactorEntities';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class ExportWorkspaceAction extends EntityAction<IDEWorkspace> {
  static NAME = 'Export workspace';
  static FILENAME = 'workspace.json';

  constructor() {
    super({
      id: 'EXPORT_WORKSPACE',
      name: ExportWorkspaceAction.NAME,
      icon: 'upload',
      target: ReactorEntities.WORKSPACE
    });
  }

  static get(): ExportWorkspaceAction {
    return ioc.get(ActionStore).getAction(ExportWorkspaceAction.NAME);
  }

  async fireEvent(event: EntityActionEvent<IDEWorkspace>): Promise<any> {
    await this.dialogStore.showCustomDialog({
      title: 'Export workspace',
      message: 'Click the button below to download the workspace',
      generateUI: (event2) => {
        return (
          <DownloadWorkspaceIcon
            url={ioc.get(WorkspaceStore).getExportedWorkspaceURL(event.targetEntity.name)}
            filename={ExportWorkspaceAction.FILENAME}
          />
        );
      }
    });
  }
}
