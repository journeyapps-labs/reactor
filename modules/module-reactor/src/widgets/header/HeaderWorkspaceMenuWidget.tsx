import * as React from 'react';
import * as _ from 'lodash';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { DialogStore } from '../../stores';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { TabSelectionKeyboardWidget } from '../tabs/TabSelectionKeyboardWidget';
import { ResetWorkspacesAction } from '../../actions/builtin-actions/workspace/ResetWorkspacesAction';
import { ActionSource } from '../../actions/Action';
import { ExportWorkspaceAction } from '../../actions/builtin-actions/workspace/ExportWorkspaceAction';
import { ExportWorkspacesAction } from '../../actions/builtin-actions/workspace/ExportWorkspacesAction';
import { ImportWorkspaceAction } from '../../actions/builtin-actions/workspace/ImportWorkspaceAction';
import { SwitchWorkspaceAction } from '../../actions/builtin-actions/SwitchWorkspaceAction';
import { MetaButton } from './HeaderMetaButtonWidget';
import { CreateWorkspaceAction } from '../../actions/builtin-actions/workspace/CreateWorkspaceAction';

@observer
export class HeaderWorkspaceMenuWidget extends React.Component {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  render() {
    return (
      <>
        <TabSelectionKeyboardWidget
          tabSelected={(selected) => {
            SwitchWorkspaceAction.get().fireAction({
              targetEntity: this.workspaceStore.getWorkspace(selected),
              source: ActionSource.BUTTON
            });
          }}
          tabRightClick={async (event, tab) => {
            // dont allow users to manage workspaces when simple mode is enabled
            if (!AdvancedWorkspacePreference.enabled()) {
              return;
            }

            const selection = await this.comboBoxStore.showComboBox(
              [
                {
                  key: 'delete',
                  icon: 'trash',
                  title: 'Delete workspace',
                  group: 'workspace'
                },
                {
                  key: 'clone',
                  icon: 'clone',
                  title: 'Clone workspace',
                  group: 'workspace'
                },
                {
                  key: 'rename',
                  icon: 'i-cursor',
                  title: 'Rename workspace',
                  group: 'workspace'
                },
                {
                  ...ResetWorkspacesAction.get().representAsComboBoxItem(),
                  group: 'reset'
                },
                {
                  ...ImportWorkspaceAction.get().representAsComboBoxItem(),
                  group: 'actions'
                },
                {
                  ...ExportWorkspaceAction.get().representAsComboBoxItem(),
                  group: 'actions',
                  download: {
                    url: this.workspaceStore.getExportedWorkspaceURL(tab.key),
                    name: ExportWorkspaceAction.FILENAME
                  }
                },
                {
                  ...ExportWorkspacesAction.get().representAsComboBoxItem(),
                  group: 'actions',
                  download: {
                    url: this.workspaceStore.getExportedWorkspacesURL(),
                    name: ExportWorkspacesAction.FILENAME
                  }
                }
              ],
              event
            );

            // delete workspace
            if (selection?.key === 'delete') {
              this.workspaceStore.deleteWorkspace(tab.name);
            }
            // import
            if (selection?.key === ImportWorkspaceAction.NAME) {
              this.workspaceStore.importWorkspace();
            }
            // clone workspace
            else if (selection?.key === 'clone') {
              const name = await this.dialogStore.showInputDialog({
                title: 'Clone workspace',
                message: 'Enter the name for this cloned workspace'
              });
              if (name) {
                this.workspaceStore.cloneWorkspace(_.capitalize(name), tab.key);
              }
            }
            // rename workspace
            else if (selection?.key === 'rename') {
              const name = await this.dialogStore.showInputDialog({
                title: 'Rename workspace',
                message: `Enter the new name for workspace ${tab.name}`
              });
              if (name) {
                this.workspaceStore.renameWorkspace(_.capitalize(name), tab.key);
              }
            } else if (selection?.key === ResetWorkspacesAction.NAME) {
              ResetWorkspacesAction.get().fireAction({
                source: ActionSource.RIGHT_CLICK
              });
            }
          }}
          selected={this.workspaceStore.currentModel}
          tabs={this.workspaceStore.workspaces.map((workspace, i) => {
            return {
              key: workspace.name,
              name: workspace.name
            };
          })}
        />
        {CreateWorkspaceAction.get().renderAsButton((btn) => {
          return <MetaButton btn={btn} />;
        })}
      </>
    );
  }
}
