import * as React from 'react';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { DialogStore } from '../../stores/DialogStore';
import { TabSelectionKeyboardWidget } from '../tabs/TabSelectionKeyboardWidget';
import { MetaButton } from './HeaderMetaButtonWidget';
import { CreateWorkspaceAction } from '../../actions/builtin-actions/workspace/CreateWorkspaceAction';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showWorkspaceContextMenu } from '../workspace/showWorkspaceContextMenu';

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    min-width: 0;
  `;

  export const WorkspaceTabContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      opacity: 0.55;
      font-size: 12px;
    }
  `;
}

export interface HeaderWorkspaceMenuWidgetProps {
  selectedBoundsUpdated?: (rect: { left: number; width: number }) => any;
  tabRightClick?: (event, tab) => any;
  pinnedSubMenu: boolean;
  workspaceGroupHovered?: (key: string | null, rect?: { left: number; width: number }) => any;
}

@observer
export class HeaderWorkspaceMenuWidget extends React.Component<HeaderWorkspaceMenuWidgetProps> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  selectWorkspace = async (selected: string) => {
    await this.workspaceStore.setActiveWorkspace(selected);
  };

  getWorkspaceContextMenu = async (event, tab) => {
    if (this.props.tabRightClick) {
      return this.props.tabRightClick(event, tab);
    }

    const workspace = this.workspaceStore.getTopLevelWorkspace(tab.key) || this.workspaceStore.getWorkspace(tab.key);
    if (!workspace) {
      return;
    }

    return showWorkspaceContextMenu({
      comboBoxStore: this.comboBoxStore,
      dialogStore: this.dialogStore,
      workspaceStore: this.workspaceStore,
      workspace,
      position: event
    });
  };

  getWorkspaceTabLabel = (workspace) => {
    if (this.props.pinnedSubMenu || workspace.key !== this.workspaceStore.currentTopWorkspace) {
      return workspace.name;
    }

    const activeSubWorkspace = this.workspaceStore.getWorkspace(this.workspaceStore.currentModel);
    if (!activeSubWorkspace || activeSubWorkspace.key === workspace.key) {
      return workspace.name;
    }

    return `${workspace.name}: ${activeSubWorkspace.name}`;
  };

  render() {
    return (
      <S.Container>
        <TabSelectionKeyboardWidget
          tabSelected={this.selectWorkspace}
          tabRightClick={this.getWorkspaceContextMenu}
          selected={this.workspaceStore.currentTopWorkspace || this.workspaceStore.currentModel}
          selectedBoundsUpdated={this.props.selectedBoundsUpdated}
          tabs={this.workspaceStore.getTopLevelWorkspaces().map((workspace) => {
            const hasChildren = workspace.getChildren().length > 0;
            return {
              key: workspace.key,
              name: this.getWorkspaceTabLabel(workspace),
              tabMouseEnter: (event) => {
                const workspaceKey = hasChildren ? workspace.key : null;
                this.props.workspaceGroupHovered?.(
                  workspaceKey,
                  workspaceKey ? event.currentTarget.getBoundingClientRect() : undefined
                );
              },
              tabContent: hasChildren
                ? () => {
                    return (
                      <S.WorkspaceTabContent>
                        <span>{this.getWorkspaceTabLabel(workspace)}</span>
                        <FontAwesomeIcon className="icon" icon="layer-group" />
                      </S.WorkspaceTabContent>
                    );
                  }
                : null
            };
          })}
        />
        {CreateWorkspaceAction.get().renderAsButton((btn) => {
          return <MetaButton btn={btn} />;
        })}
      </S.Container>
    );
  }
}
