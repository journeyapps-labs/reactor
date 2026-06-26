import * as React from 'react';
import * as _ from 'lodash';
import { MouseEvent } from 'react';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { DialogStore } from '../../stores/DialogStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResetWorkspacesAction } from '../../actions/builtin-actions/workspace/ResetWorkspacesAction';
import { ImportWorkspaceAction } from '../../actions/builtin-actions/workspace/ImportWorkspaceAction';
import { ExportWorkspacesAction } from '../../actions/builtin-actions/workspace/ExportWorkspacesAction';
import { ActionSource } from '../../actions/Action';

export interface HeaderWorkspaceSubMenuWidgetProps {
  offsetLeft: number;
  tabRightClick?: (event: MouseEvent, tab: { key: string; name: string }) => any;
}

namespace S {
  export const Bar = themed.div`
    display: flex;
    align-items: center;
    min-height: 42px;
    flex-grow: 0;
    flex-shrink: 0;
    background: ${(p) => p.theme.workspaceSubMenu.background};
    user-select: none;
    overflow-x: auto;

    ::-webkit-scrollbar {
      display: none;
    }
  `;

  export const Items = styled.div<{ offsetLeft: number }>`
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: ${(p) => Math.max(0, p.offsetLeft)}px;
    padding-right: 20px;
  `;

  export const Pill = themed.div<{ selected: boolean }>`
    flex-shrink: 0;
    border-radius: 999px;
    padding: 4px 10px;
    color: ${(p) => (p.selected ? p.theme.workspaceSubMenu.foregroundActive : p.theme.workspaceSubMenu.foreground)};
    cursor: pointer;
    background: ${(p) =>
      p.selected ? p.theme.workspaceSubMenu.backgroundActive : p.theme.workspaceSubMenu.background};
    font-family: ${Fonts.PRIMARY};
    font-size: 13px;
    line-height: 16px;
    white-space: nowrap;

    &:hover {
      color: ${(p) => p.theme.workspaceSubMenu.foregroundHover};
      background: ${(p) =>
        p.selected ? p.theme.workspaceSubMenu.backgroundActive : p.theme.workspaceSubMenu.backgroundHover};
    }
  `;

  export const AddButton = themed.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 999px;
    padding: 0;
    color: ${(p) => p.theme.workspaceSubMenu.foreground};
    background: ${(p) => p.theme.workspaceSubMenu.background};
    cursor: pointer;

    &:hover {
      color: ${(p) => p.theme.workspaceSubMenu.foregroundHover};
      background: ${(p) => p.theme.workspaceSubMenu.backgroundHover};
    }
  `;
}

@observer
export class HeaderWorkspaceSubMenuWidget extends React.Component<HeaderWorkspaceSubMenuWidgetProps> {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  addWorkspace = async () => {
    const workspace = this.workspaceStore.getActiveTopWorkspace();
    if (!workspace || workspace.getChildren().length === 0) {
      return;
    }

    const name = await this.dialogStore.showInputDialog({
      title: 'Create nested workspace',
      message: `Enter the name for a workspace in ${workspace.name}`
    });
    if (name) {
      await this.workspaceStore.newWorkspaceInGroup(workspace.key, _.capitalize(name));
    }
  };

  getWorkspaceContextMenu = async (event: MouseEvent, tab: { key: string; name: string }) => {
    if (this.props.tabRightClick) {
      return this.props.tabRightClick(event, tab);
    }

    if (!AdvancedWorkspacePreference.enabled()) {
      return;
    }

    const workspace = this.workspaceStore.getWorkspace(tab.key);
    if (!workspace) {
      return;
    }

    const items: ComboBoxItem[] = [
      ...workspace.getContextMenuItems({
        workspaceStore: this.workspaceStore,
        dialogStore: this.dialogStore
      }),
      {
        ...ResetWorkspacesAction.get().representAsComboBoxItem(),
        group: 'reset'
      },
      {
        ...ImportWorkspaceAction.get().representAsComboBoxItem(),
        group: 'actions'
      },
      {
        ...ExportWorkspacesAction.get().representAsComboBoxItem(),
        group: 'actions',
        download: {
          url: this.workspaceStore.getExportedWorkspacesURL(),
          name: ExportWorkspacesAction.FILENAME
        }
      }
    ];

    const selection = await this.comboBoxStore.showComboBox(items, event);
    if (selection?.action) {
      await selection.action(event);
      return;
    }

    if (selection?.key === ImportWorkspaceAction.NAME) {
      this.workspaceStore.importWorkspace();
    } else if (selection?.key === ResetWorkspacesAction.NAME) {
      ResetWorkspacesAction.get().fireAction({
        source: ActionSource.RIGHT_CLICK
      });
    }
  };

  render() {
    const workspaces = this.workspaceStore.getActiveTopWorkspace()?.getChildren() || [];
    if (workspaces.length === 0) {
      return null;
    }

    return (
      <S.Bar>
        <S.Items offsetLeft={this.props.offsetLeft}>
          {workspaces.map((workspace) => {
            const tab = {
              key: workspace.key,
              name: workspace.name
            };
            return (
              <S.Pill
                key={workspace.key}
                selected={workspace.key === this.workspaceStore.currentModel}
                onClick={() => {
                  this.workspaceStore.setActiveWorkspace(workspace.key);
                }}
                onContextMenu={(event) => {
                  event.persist();
                  event.preventDefault();
                  this.getWorkspaceContextMenu(event, tab);
                }}
              >
                {workspace.name}
              </S.Pill>
            );
          })}
          {AdvancedWorkspacePreference.enabled() ? (
            <S.AddButton onClick={this.addWorkspace} title="Create nested workspace">
              <FontAwesomeIcon icon="plus" />
            </S.AddButton>
          ) : null}
        </S.Items>
      </S.Bar>
    );
  }
}
