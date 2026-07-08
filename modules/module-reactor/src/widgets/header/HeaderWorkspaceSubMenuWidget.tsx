import * as React from 'react';
import * as _ from 'lodash';
import { MouseEvent } from 'react';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { css, keyframes } from '@emotion/react';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { DialogStore } from '../../stores/DialogStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResetWorkspacesAction } from '../../actions/builtin-actions/workspace/ResetWorkspacesAction';
import { ImportWorkspaceAction } from '../../actions/builtin-actions/workspace/ImportWorkspaceAction';
import { ExportWorkspacesAction } from '../../actions/builtin-actions/workspace/ExportWorkspacesAction';
import { ActionSource } from '../../actions/Action';
import { TabDirective } from '../tabs/TabListWidget';
import { TabSelectionWidget } from '../tabs/TabSelectionWidget';
import { WORKSPACE_PANEL_INSET, WORKSPACE_PANEL_RADIUS } from '../workspace/workspacePanelChrome';
import { WorkspaceGroup } from '../../stores/workspace/models/WorkspaceGroup';

export interface HeaderWorkspaceSubMenuWidgetProps {
  offsetLeft: number;
  workspaceKey?: string;
  pinned: boolean;
  togglePinned: () => any;
  hoverActive?: () => any;
  hoverInactive?: () => any;
  tabRightClick?: (event: MouseEvent, tab: { key: string; name: string }) => any;
}

namespace S {
  const unpinnedBarEnter = keyframes`
    from {
      opacity: 0;
      transform: translateY(-12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  export const Bar = themed.div<{ pinned: boolean }>`
    display: flex;
    align-items: center;
    min-height: 30px;
    flex-grow: 0;
    flex-shrink: 0;
    background: ${(p) => (p.pinned ? p.theme.workspaceSubMenu.background : p.theme.workspaceSubMenu.backgroundUnPinned)};
    user-select: none;
    overflow-x: auto;
    ${(p) =>
      p.pinned
        ? css`
            margin-top: 1px;
            margin-left: ${WORKSPACE_PANEL_INSET}px;
            margin-right: ${WORKSPACE_PANEL_INSET}px;
            border-bottom-left-radius: ${WORKSPACE_PANEL_RADIUS}px;
            border-bottom-right-radius: ${WORKSPACE_PANEL_RADIUS}px;
            overflow-y: hidden;
          `
        : css`
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 5;
            box-shadow: 0 10px 14px -10px rgba(0, 0, 0, 0.55);
            animation: ${unpinnedBarEnter} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            min-height: 34px;
          `}

    ::-webkit-scrollbar {
      display: none;
    }
  `;

  const TAB_HORIZONTAL_PADDING = 5;

  export const Items = styled.div<{ offsetLeft: number }>`
    display: flex;
    align-items: center;
    padding-left: ${(p) => Math.max(0, p.offsetLeft - TAB_HORIZONTAL_PADDING)}px;
    padding-right: 20px;

    transition: padding-left 0.2s ease-out;
  `;

  export const Tabs = styled(TabSelectionWidget)`
    flex-shrink: 0;
  `;

  export const IconButton = themed.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 999px;
    padding: 0;
    color: ${(p) => (p.$active ? p.theme.combobox.text : p.theme.workspaceSubMenu.foreground)};
    background: ${(p) => (p.$active ? p.theme.tabs.selectedBackground : 'transparent')};
    cursor: pointer;

    &:hover {
      color: ${(p) => p.theme.combobox.text};
      background: ${(p) => p.theme.tabs.selectedBackground};
    }
  `;

  export const UnpinnedIcon = styled(FontAwesomeIcon)`
    transform: rotate(45deg);
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

  getDisplayedWorkspace = () => {
    if (!this.props.pinned && !this.props.workspaceKey) {
      return null;
    }

    return this.props.workspaceKey
      ? this.workspaceStore.getTopLevelWorkspace(this.props.workspaceKey)
      : this.workspaceStore.getActiveTopWorkspace();
  };

  addWorkspace = async () => {
    const workspace = this.getDisplayedWorkspace();
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

  getSelectedWorkspace = (workspace: ReturnType<HeaderWorkspaceSubMenuWidget['getDisplayedWorkspace']>) => {
    if (this.props.pinned) {
      return this.workspaceStore.currentModel;
    }

    if (workspace?.key === this.workspaceStore.currentTopWorkspace) {
      return this.workspaceStore.currentModel;
    }

    return workspace instanceof WorkspaceGroup ? workspace.lastActiveChildId : workspace?.getChildren()[0]?.key;
  };

  render() {
    const workspace = this.getDisplayedWorkspace();
    const workspaces = workspace?.getChildren() || [];
    if (workspaces.length === 0) {
      return null;
    }
    const tabs: TabDirective[] = workspaces.map((workspace) => ({
      key: workspace.key,
      name: workspace.name
    }));
    const selectedWorkspace = this.getSelectedWorkspace(workspace) || workspaces[0]?.key;

    return (
      <S.Bar pinned={this.props.pinned} onMouseEnter={this.props.hoverActive} onMouseLeave={this.props.hoverInactive}>
        <S.Items offsetLeft={this.props.offsetLeft}>
          <S.Tabs
            compact
            tabs={tabs}
            selected={selectedWorkspace}
            tabSelected={(key) => {
              this.workspaceStore.setActiveWorkspace(key);
            }}
            tabRightClick={this.getWorkspaceContextMenu}
          />
          <S.IconButton
            $active={this.props.pinned}
            onClick={this.props.togglePinned}
            title={this.props.pinned ? 'Unpin nested workspace tabs' : 'Pin nested workspace tabs'}
          >
            {this.props.pinned ? <FontAwesomeIcon icon="thumbtack" /> : <S.UnpinnedIcon icon="thumbtack" />}
          </S.IconButton>
          {AdvancedWorkspacePreference.enabled() ? (
            <S.IconButton onClick={this.addWorkspace} title="Create nested workspace">
              <FontAwesomeIcon icon="plus" />
            </S.IconButton>
          ) : null}
        </S.Items>
      </S.Bar>
    );
  }
}
