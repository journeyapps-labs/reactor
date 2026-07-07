import * as React from 'react';
import { keyframes } from '@emotion/react';
import { observer } from 'mobx-react';

import { WorkspaceEntry, WorkspaceStore } from '../../stores/workspace/WorkspaceStore';
import { ioc } from '../../inversify.config';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import { IconWidget } from '../icons/IconWidget';
import { useLongPressContextMenu } from '../../hooks/useLongPressContextMenu';
import { showWorkspaceContextMenu } from '../workspace/showWorkspaceContextMenu';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { DialogStore } from '../../stores/DialogStore';

export interface MobileWorkspaceDrawerWidgetProps {
  close: () => void;
}

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
    background: ${(p) => p.theme.mobileNavigation.background};
    color: ${(p) => p.theme.mobileNavigation.foreground};
    box-shadow: 6px 0 24px rgba(0, 0, 0, 0.35);
    animation: ${slideIn} 0.18s ease-out;
  `;

  export const DrawerHeader = themed.div`
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 6px;
    border-bottom: solid 1px ${(p) => p.theme.mobileNavigation.border};
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

  export const GroupSection = styled.div`
    margin-bottom: 3px;
  `;

  export const WorkspaceButton = themed.button<{ selected: boolean }>`
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
    color: ${(p) => (p.selected ? p.theme.mobileNavigation.selectedForeground : p.theme.mobileNavigation.foreground)};
    background: ${(p) =>
      p.selected ? p.theme.mobileNavigation.selectedBackground : p.theme.mobileNavigation.background};
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
    color: ${(p) => p.theme.mobileNavigation.foreground};
    background: ${(p) => p.theme.mobileNavigation.background};
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

  export const Children = styled.div`
    padding-left: 20px;
  `;
}

const MobileWorkspaceDrawerItem: React.FC<{
  workspace: WorkspaceEntry;
  expandedKeys: string[];
  collapsedKeys: string[];
  toggleExpanded: (workspace: WorkspaceEntry) => void;
  selectWorkspace: (key: string) => void;
}> = observer((props) => {
  const workspaceStore = ioc.get(WorkspaceStore);
  const comboBoxStore = ioc.get(ComboBoxStore);
  const dialogStore = ioc.get(DialogStore);
  const showContextMenu = React.useCallback(
    (position) => {
      return showWorkspaceContextMenu({
        comboBoxStore,
        dialogStore,
        workspaceStore,
        workspace: props.workspace,
        position
      });
    },
    [comboBoxStore, dialogStore, workspaceStore, props.workspace]
  );
  const groupRef = React.useRef<HTMLButtonElement>(null);
  const workspaceRef = React.useRef<HTMLButtonElement>(null);
  useLongPressContextMenu(groupRef, showContextMenu);
  useLongPressContextMenu(workspaceRef, showContextMenu);
  const selected =
    props.workspace.key === workspaceStore.currentTopWorkspace || props.workspace.key === workspaceStore.currentModel;
  const expanded =
    props.collapsedKeys.indexOf(props.workspace.key) === -1 &&
    (props.workspace.key === workspaceStore.currentTopWorkspace ||
      props.expandedKeys.indexOf(props.workspace.key) !== -1);
  const children = props.workspace.getChildren();

  if (children.length > 0) {
    return (
      <S.GroupSection>
        <S.GroupButton ref={groupRef} onClick={() => props.toggleExpanded(props.workspace)}>
          <S.GroupLabel>{props.workspace.name}</S.GroupLabel>
          <S.ChevronButton
            onClick={(event) => {
              event.stopPropagation();
              props.toggleExpanded(props.workspace);
            }}
          >
            <IconWidget icon={expanded ? 'angle-down' : 'angle-right'} />
          </S.ChevronButton>
        </S.GroupButton>
        {expanded ? (
          <S.Children>
            {children.map((child) => {
              return (
                <MobileWorkspaceDrawerItem
                  key={child.key}
                  workspace={child}
                  expandedKeys={props.expandedKeys}
                  collapsedKeys={props.collapsedKeys}
                  toggleExpanded={props.toggleExpanded}
                  selectWorkspace={props.selectWorkspace}
                />
              );
            })}
          </S.Children>
        ) : null}
      </S.GroupSection>
    );
  }

  return (
    <S.WorkspaceButton
      ref={workspaceRef}
      selected={selected}
      onClick={() => props.selectWorkspace(props.workspace.key)}
    >
      <span>{props.workspace.name}</span>
    </S.WorkspaceButton>
  );
});

export const MobileWorkspaceDrawerWidget: React.FC<MobileWorkspaceDrawerWidgetProps> = observer((props) => {
  const workspaceStore = ioc.get(WorkspaceStore);
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);
  const [collapsedKeys, setCollapsedKeys] = React.useState<string[]>([]);

  const toggleExpanded = (workspace: WorkspaceEntry) => {
    const expanded =
      collapsedKeys.indexOf(workspace.key) === -1 &&
      (workspace.key === workspaceStore.currentTopWorkspace || expandedKeys.indexOf(workspace.key) !== -1);
    setExpandedKeys(expanded ? expandedKeys.filter((key) => key !== workspace.key) : [...expandedKeys, workspace.key]);
    setCollapsedKeys(
      expanded ? [...collapsedKeys, workspace.key] : collapsedKeys.filter((key) => key !== workspace.key)
    );
  };

  const selectWorkspace = async (key: string) => {
    await workspaceStore.setActiveWorkspace(key);
    props.close();
  };

  return (
    <>
      <S.Scrim onClick={props.close} />
      <S.Drawer>
        <S.DrawerHeader>
          <S.IconButton onClick={props.close}>
            <IconWidget icon="times" />
          </S.IconButton>
          <span>Workspaces</span>
        </S.DrawerHeader>
        <S.WorkspaceList>
          {workspaceStore.getTopLevelWorkspaces().map((workspace) => {
            return (
              <MobileWorkspaceDrawerItem
                key={workspace.key}
                workspace={workspace}
                expandedKeys={expandedKeys}
                collapsedKeys={collapsedKeys}
                toggleExpanded={toggleExpanded}
                selectWorkspace={selectWorkspace}
              />
            );
          })}
        </S.WorkspaceList>
      </S.Drawer>
    </>
  );
});
