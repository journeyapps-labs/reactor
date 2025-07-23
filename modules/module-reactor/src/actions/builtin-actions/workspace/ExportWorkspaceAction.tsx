import { inject, ioc } from '../../../inversify.config';
import { WorkspaceStore, IDEWorkspace } from '../../../stores/workspace/WorkspaceStore';
import { System } from '../../../core/System';
import React from 'react';
import { DownloadWorkspaceIcon } from './ExportWorkspacesAction';
import { EntityAction, EntityActionEvent } from '../../parameterized/EntityAction';
import { WorkspaceProvider } from '../../../providers/WorkspaceProvider';

export class ExportWorkspaceAction extends EntityAction<IDEWorkspace> {
  static NAME = 'Export workspace';
  static FILENAME = 'workspace.json';

  constructor() {
    super({
      id: 'EXPORT_WORKSPACE',
      name: ExportWorkspaceAction.NAME,
      icon: 'upload',
      target: WorkspaceProvider.NAME
    });
  }

  static get(): ExportWorkspaceAction {
    return ioc.get(System).getAction(ExportWorkspaceAction.NAME);
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
