import * as React from 'react';
import { observer } from 'mobx-react';
import { keyframes } from '@emotion/react';

import { inject } from '../../inversify.config';
import { CMDPalletStore } from '../../stores/CMDPalletStore';
import { UXStore } from '../../stores/UXStore';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { ComboBoxStore2 } from '../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { WorkspaceEntry, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { WorkspaceModel } from '../../stores/workspace/models/WorkspaceModel';
import { Btn } from '../../definitions/common';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { IconWidget } from '../icons/IconWidget';
import { MobileWorkspaceWidget } from './MobileWorkspaceWidget';

namespace S {
  export const slideIn = keyframes`
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  `;

  export const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  export const Shell = themed.div<{ locked: boolean }>`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.workspace.background};
    ${(p) => (p.locked ? 'filter: blur(5px); pointer-events: none;' : '')};
  `;

  export const Header = themed.div`
    flex-shrink: 0;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    background: ${(p) => p.theme.header.background};
    color: ${(p) => p.theme.header.foreground};
    font-family: ${Fonts.PRIMARY};
  `;

  export const HeaderLeft = styled.div`
    min-width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  export const HeaderRight = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0;
  `;

  export const IconButton = themed.button`
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 6px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.header.foreground};
    background: transparent;
    font-size: 24px;
  `;

  export const HamburgerButton = themed.button`
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 6px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.header.foreground};
    background: transparent;
  `;

  export const HamburgerIcon = styled(IconWidget)`
    font-size: 24px;
  `;

  export const Logo = styled.img`
    width: 30px;
    height: 30px;
    object-fit: contain;
  `;

  export const Title = styled.div`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 600;
  `;

  export const Content = styled.div`
    position: relative;
    flex-grow: 1;
    min-height: 0;
  `;

  export const Scrim = styled.div`
    position: absolute;
    inset: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.45);
    animation: ${fadeIn} 0.16s ease-out;
  `;

  export const Drawer = themed.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 21;
    width: min(300px, 84vw);
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.workspaceSubMenu.background};
    color: ${(p) => p.theme.workspaceSubMenu.foreground};
    box-shadow: 6px 0 24px rgba(0, 0, 0, 0.35);
    animation: ${slideIn} 0.18s ease-out;
  `;

  export const DrawerHeader = themed.div`
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 6px;
    border-bottom: solid 1px ${(p) => p.theme.workspace.overlayDividerHover};
    font-family: ${Fonts.PRIMARY};
    font-size: 14px;
    font-weight: 600;
  `;

  export const WorkspaceList = styled.div`
    flex-grow: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 6px;
  `;

  export const GroupSection = styled.div`
    margin-bottom: 3px;
  `;

  export const WorkspaceButton = themed.button<{ selected: boolean; nested?: boolean }>`
    width: 100%;
    min-height: 33px;
    border: 0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 8px;
    margin-bottom: 1px;
    text-align: left;
    color: ${(p) => (p.selected ? p.theme.workspaceSubMenu.foregroundActive : p.theme.workspaceSubMenu.foreground)};
    background: ${(p) =>
      p.selected ? p.theme.workspaceSubMenu.backgroundActive : p.theme.workspaceSubMenu.background};
    font-family: ${Fonts.PRIMARY};
    font-size: 15px;
    font-weight: ${(p) => (p.selected ? 600 : 500)};
  `;

  export const GroupButton = themed.button`
    width: 100%;
    min-height: 33px;
    border: 0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 8px;
    margin-bottom: 1px;
    text-align: left;
    color: ${(p) => p.theme.workspaceSubMenu.foreground};
    background: ${(p) => p.theme.workspaceSubMenu.background};
    font-family: ${Fonts.PRIMARY};
    font-size: 15px;
    font-weight: 600;
  `;

  export const ChevronButton = styled.span`
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: auto;
  `;

  export const GroupLabel = styled.span`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `;

  export const Children = themed.div`
    padding-left: 20px;
  `;
}

export interface MobileReactorShellProps {
  locked: boolean;
  logoClicked: (event: React.MouseEvent) => any;
  workspaceRef: React.RefObject<HTMLDivElement>;
}

interface MobileReactorShellState {
  drawerOpen: boolean;
  expandedWorkspaceKeys: string[];
  collapsedWorkspaceKeys: string[];
}

@observer
export class MobileReactorShell extends React.Component<MobileReactorShellProps, MobileReactorShellState> {
  @inject(UXStore)
  accessor uxStore: UXStore;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  @inject(CMDPalletStore)
  accessor commandPalletStore: CMDPalletStore;

  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  constructor(props: MobileReactorShellProps) {
    super(props);
    this.state = {
      drawerOpen: false,
      expandedWorkspaceKeys: [],
      collapsedWorkspaceKeys: []
    };
  }

  closeDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  selectWorkspace = async (key: string) => {
    await this.workspaceStore.setActiveWorkspace(key);
    this.closeDrawer();
  };

  btnToComboBoxItem(btn: Btn, index: number): ComboBoxItem {
    return {
      key: btn.label || btn.tooltip || `mobile-header-action-${index}`,
      title: btn.label || btn.tooltip || 'Action',
      icon: btn.icon,
      action: async (event) => {
        await btn.action?.(event);
      }
    };
  }

  getMobileMenuItems(): ComboBoxItem[] {
    return [
      ...this.uxStore.headerMetaIcons.map((btn, index) => {
        return {
          ...this.btnToComboBoxItem(btn, index),
          group: 'Actions'
        };
      }),
      ...Array.from(this.uxStore.accountButtonOptions.values()).map((item) => {
        return {
          ...item,
          group: item.group || 'Account'
        };
      })
    ];
  }

  showMobileMenu = async (event: React.MouseEvent) => {
    const items = this.getMobileMenuItems();
    if (items.length === 0) {
      return;
    }

    await this.comboBoxStore.show(
      new SimpleComboBoxDirective({
        items,
        event,
        title: this.uxStore.account?.name || 'Menu',
        subtitle: this.uxStore.account?.email
      })
    );
  };

  isExpanded(workspace: WorkspaceEntry | WorkspaceModel) {
    if (this.state.collapsedWorkspaceKeys.indexOf(workspace.key) !== -1) {
      return false;
    }
    return (
      workspace.key === this.workspaceStore.currentTopWorkspace ||
      this.state.expandedWorkspaceKeys.indexOf(workspace.key) !== -1
    );
  }

  toggleExpanded(workspace: WorkspaceEntry | WorkspaceModel) {
    const expanded = this.isExpanded(workspace);
    this.setState({
      expandedWorkspaceKeys: expanded
        ? this.state.expandedWorkspaceKeys.filter((key) => key !== workspace.key)
        : [...this.state.expandedWorkspaceKeys, workspace.key],
      collapsedWorkspaceKeys: expanded
        ? [...this.state.collapsedWorkspaceKeys, workspace.key]
        : this.state.collapsedWorkspaceKeys.filter((key) => key !== workspace.key)
    });
  }

  renderWorkspaceButton(workspace: WorkspaceEntry | WorkspaceModel) {
    const selected =
      workspace.key === this.workspaceStore.currentTopWorkspace || workspace.key === this.workspaceStore.currentModel;
    const hasChildren = workspace.getChildren().length > 0;

    if (hasChildren) {
      const expanded = this.isExpanded(workspace);
      return (
        <S.GroupSection key={workspace.key}>
          <S.GroupButton
            onClick={() => {
              this.toggleExpanded(workspace);
            }}
          >
            <S.GroupLabel>{workspace.name}</S.GroupLabel>
            <S.ChevronButton
              onClick={(event) => {
                event.stopPropagation();
                this.toggleExpanded(workspace);
              }}
            >
              <IconWidget icon={expanded ? 'angle-down' : 'angle-right'} />
            </S.ChevronButton>
          </S.GroupButton>
          {expanded ? (
            <S.Children>{workspace.getChildren().map((child) => this.renderWorkspaceButton(child))}</S.Children>
          ) : null}
        </S.GroupSection>
      );
    }

    return (
      <S.WorkspaceButton key={workspace.key} selected={selected} onClick={() => this.selectWorkspace(workspace.key)}>
        <span>{workspace.name}</span>
      </S.WorkspaceButton>
    );
  }

  renderDrawer() {
    if (!this.state.drawerOpen) {
      return null;
    }

    return (
      <>
        <S.Scrim onClick={this.closeDrawer} />
        <S.Drawer>
          <S.DrawerHeader>
            <S.IconButton onClick={this.closeDrawer}>
              <IconWidget icon="times" />
            </S.IconButton>
            <span>Workspaces</span>
          </S.DrawerHeader>
          <S.WorkspaceList>
            {this.workspaceStore.getTopLevelWorkspaces().map((workspace) => this.renderWorkspaceButton(workspace))}
          </S.WorkspaceList>
        </S.Drawer>
      </>
    );
  }

  render() {
    const primaryTitle = this.uxStore.primaryHeader?.label;

    return (
      <S.Shell locked={this.props.locked}>
        <S.Header>
          <S.HeaderLeft>
            <S.HamburgerButton onClick={() => this.setState({ drawerOpen: true })}>
              <S.HamburgerIcon icon="bars" />
            </S.HamburgerButton>
            {this.uxStore.primaryLogo ? (
              <S.Logo src={this.uxStore.primaryLogo} onClick={this.props.logoClicked} />
            ) : null}
            <S.Title>{primaryTitle}</S.Title>
          </S.HeaderLeft>
          <S.HeaderRight>
            <S.IconButton onClick={() => this.commandPalletStore.showPallet(true)}>
              <IconWidget icon="search" />
            </S.IconButton>
            <S.IconButton onClick={this.showMobileMenu}>
              <IconWidget icon="ellipsis-v" />
            </S.IconButton>
          </S.HeaderRight>
        </S.Header>
        <S.Content>
          <MobileWorkspaceWidget forwardRef={this.props.workspaceRef} />
        </S.Content>
        {this.renderDrawer()}
      </S.Shell>
    );
  }
}
