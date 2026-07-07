import { ActionSource } from '../../actions/Action';
import { ExportWorkspacesAction } from '../../actions/builtin-actions/workspace/ExportWorkspacesAction';
import { ImportWorkspaceAction } from '../../actions/builtin-actions/workspace/ImportWorkspaceAction';
import { ResetWorkspacesAction } from '../../actions/builtin-actions/workspace/ResetWorkspacesAction';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { DialogStore } from '../../stores/DialogStore';
import { WorkspaceEntry, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';

export interface ShowWorkspaceContextMenuOptions {
  comboBoxStore: ComboBoxStore;
  dialogStore: DialogStore;
  workspaceStore: WorkspaceStore;
  workspace: WorkspaceEntry;
  position: MousePosition | MouseEvent;
}

export const showWorkspaceContextMenu = async (options: ShowWorkspaceContextMenuOptions) => {
  if (!AdvancedWorkspacePreference.enabled()) {
    return;
  }

  const items: ComboBoxItem[] = options.workspace.getContextMenuItems({
    workspaceStore: options.workspaceStore,
    dialogStore: options.dialogStore
  });
  const exportItem = items.find((item) => item.key === 'export');
  if (exportItem) {
    exportItem.children = [
      ...(exportItem.children || []),
      {
        ...ExportWorkspacesAction.get().representAsComboBoxItem(),
        key: 'export-all-workspaces',
        title: 'Export all workspaces',
        download: {
          url: options.workspaceStore.getExportedWorkspacesURL(),
          name: ExportWorkspacesAction.FILENAME
        }
      }
    ];
  }

  items.push(
    {
      ...ResetWorkspacesAction.get().representAsComboBoxItem(),
      group: 'reset'
    },
    {
      ...ImportWorkspaceAction.get().representAsComboBoxItem(),
      group: 'actions'
    }
  );

  const selection = await options.comboBoxStore.showComboBox(items, options.position);
  if (selection?.action) {
    await selection.action(options.position);
    return;
  }

  if (selection?.key === ImportWorkspaceAction.NAME) {
    options.workspaceStore.importWorkspace();
  } else if (selection?.key === ResetWorkspacesAction.NAME) {
    ResetWorkspacesAction.get().fireAction({
      source: ActionSource.RIGHT_CLICK
    });
  }
};
