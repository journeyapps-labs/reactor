import * as React from 'react';
import { inject, ioc } from '../../../inversify.config';
import { WorkspaceStore } from '../../../stores/workspace/WorkspaceStore';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Action, ActionEvent } from '../../Action';
import { ActionStore } from '../../../stores/actions/ActionStore';

namespace S {
  export const Download = themed.a`
    border-radius: 10px;
    background: ${(p) => p.theme.combobox.headerBackground};
    color: ${(p) => p.theme.combobox.text};
    cursor: pointer;
    user-select: none;
    margin: auto;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    font-size: 40px;

    &:hover{
      background: ${(p) => p.theme.combobox.backgroundSelected};
    }
  `;
}

export const DownloadWorkspaceIcon: React.FC<{ url: string; filename: string }> = (props) => {
  return (
    <S.Download href={props.url} download={props.filename}>
      <FontAwesomeIcon icon="download" />
    </S.Download>
  );
};

export class ExportWorkspacesAction extends Action {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  static NAME = 'Export all workspaces';
  static FILENAME = 'workspaces.json';

  constructor() {
    super({
      id: 'EXPORT_WORKSPACES',
      name: ExportWorkspacesAction.NAME,
      icon: 'upload'
    });
  }

  static get(): ExportWorkspacesAction {
    return ioc.get(ActionStore).getAction(ExportWorkspacesAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    await this.dialogStore.showCustomDialog({
      title: 'Export all workspaces',
      message: 'Click the button below to download all the workspaces',
      generateUI: (event) => {
        return (
          <DownloadWorkspaceIcon
            url={this.workspaceStore.getExportedWorkspacesURL()}
            filename={ExportWorkspacesAction.FILENAME}
          />
        );
      }
    });
  }
}
