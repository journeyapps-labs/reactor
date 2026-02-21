import { inject, ioc } from '../../../inversify.config';
import React from 'react';
import { DownloadWorkspaceIcon } from '../workspace/ExportWorkspacesAction';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { Action, ActionEvent } from '../../Action';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class ExportShortcutsAction extends Action {
  @inject(ShortcutStore)
  accessor shortcutStore: ShortcutStore;

  static NAME = 'Export shortcuts';
  static FILENAME = 'shortcuts.json';

  constructor() {
    super({
      id: 'EXPORT_SHORTCUTS',
      name: ExportShortcutsAction.NAME,
      icon: 'upload'
    });
  }

  static get(): ExportShortcutsAction {
    return ioc.get(ActionStore).getAction(ExportShortcutsAction.NAME);
  }

  async fireEvent(event: ActionEvent): Promise<any> {
    await this.dialogStore.showCustomDialog({
      title: 'Export shortcuts',
      message: 'Click the button below to download the shortcuts',
      generateUI: (event2) => {
        return (
          <DownloadWorkspaceIcon
            url={this.shortcutStore.getExportedShortcutsURL()}
            filename={ExportShortcutsAction.FILENAME}
          />
        );
      }
    });
  }
}
