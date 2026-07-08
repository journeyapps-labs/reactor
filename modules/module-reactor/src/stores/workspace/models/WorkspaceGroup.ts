import { v4 } from 'uuid';

import type { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import { ReactorRootWorkspaceModel } from '../react-workspaces/ReactorRootWorkspaceModel';
import { ReactorWorkspaceEngine } from '../ReactorWorkspaceEngine';
import {
  SerializedWorkspaceModel,
  WorkspaceActivation,
  WorkspaceContextActionContext,
  WorkspaceModel,
  WorkspaceModelCloneOptions,
  WorkspaceModelOptions
} from './WorkspaceModel';

export interface SerializedWorkspaceGroup {
  id: string;
  name: string;
  children: SerializedWorkspaceModel[];
  lastActiveChildId?: string;
}

export interface WorkspaceGroupOptions {
  id?: string;
  name: string;
  children: (WorkspaceModel | WorkspaceModelOptions)[];
  lastActiveChildId?: string;
  priority?: number;
}

export class WorkspaceGroup extends WorkspaceModel {
  children: WorkspaceModel[];
  lastActiveChildId?: string;

  constructor(options: WorkspaceGroupOptions) {
    super({
      id: options.id || options.name || v4(),
      name: options.name,
      priority: options.priority
    });
    this.children = options.children.map((workspace) => {
      const model = workspace instanceof WorkspaceModel ? workspace : new WorkspaceModel(workspace);
      model.parentId = this.key;
      return model;
    });
    this.lastActiveChildId = options.lastActiveChildId || this.children[0]?.key;
  }

  isGroup(): boolean {
    return true;
  }

  getAllWorkspaces(): WorkspaceModel[] {
    return this.children;
  }

  getChildren(): WorkspaceModel[] {
    return this.children;
  }

  addWorkspace(workspace: WorkspaceModel) {
    workspace.parentId = this.key;
    this.children.push(workspace);
    this.lastActiveChildId = workspace.key;
  }

  contains(key: string): boolean {
    return super.contains(key) || this.children.some((workspace) => workspace.contains(key));
  }

  getChild(key: string): WorkspaceModel {
    return this.children.find((workspace) => workspace.key === key);
  }

  activate(key?: string): WorkspaceActivation {
    const workspace = (key ? this.getChild(key) : null) || this.getChild(this.lastActiveChildId) || this.children[0];
    if (!workspace) {
      throw new Error(`Failed to activate workspace ${this.name}`);
    }
    this.lastActiveChildId = workspace.key;
    return {
      topWorkspace: this,
      workspace
    };
  }

  getContextMenuItems(context: WorkspaceContextActionContext): ComboBoxItem[] {
    const items: ComboBoxItem[] = [
      ...super.getContextMenuItems(context).filter((item) => item.key !== 'convert-group'),
      {
        key: 'new-child-workspace',
        icon: 'plus',
        title: 'New nested workspace',
        group: 'workspace',
        action: async () => {
          const name = await context.dialogStore.showInputDialog({
            title: 'Create nested workspace',
            message: `Enter the name for a workspace in ${this.name}`
          });
          if (name) {
            await context.workspaceStore.newWorkspaceInGroup(this.key, name.charAt(0).toUpperCase() + name.slice(1));
          }
        }
      }
    ];

    if (this.children.length === 1) {
      items.push({
        key: 'collapse-group',
        icon: 'compress',
        title: 'Collapse group',
        group: 'workspace',
        action: async () => {
          await context.workspaceStore.collapseWorkspaceGroup(this.key);
        }
      });
    }

    return items;
  }

  serialize(): SerializedWorkspaceGroup {
    return {
      id: this.id,
      name: this.name,
      lastActiveChildId: this.lastActiveChildId,
      children: this.children.map((child) => child.serialize())
    };
  }

  clone(options: {
    id: string;
    name: string;
    engine: ReactorWorkspaceEngine;
    generateRootModel: () => ReactorRootWorkspaceModel;
  }) {
    const children = this.children.map((child) => {
      return {
        sourceKey: child.key,
        workspace: child.clone({
          id: v4(),
          name: child.name,
          engine: options.engine,
          generateRootModel: options.generateRootModel
        })
      };
    });
    return new WorkspaceGroup({
      id: options.id,
      name: options.name,
      lastActiveChildId:
        children.find((child) => child.sourceKey === this.lastActiveChildId)?.workspace.key ||
        children[0]?.workspace.key,
      children: children.map((child) => child.workspace)
    });
  }

  cloneForImport(
    options: WorkspaceModelCloneOptions & {
      getSafeChildName: (name: string, siblings: { key: string; name: string }[]) => string;
    }
  ) {
    const importedChildren: { key: string; name: string }[] = [];
    const children = this.children.map((child) => {
      const name = options.getSafeChildName(child.name, importedChildren);
      const id = v4();
      importedChildren.push({ key: id, name });
      return {
        originalId: child.key,
        workspace: child.cloneForImport({
          id,
          name,
          engine: options.engine,
          generateRootModel: options.generateRootModel
        })
      };
    });

    return new WorkspaceGroup({
      id: options.id,
      name: options.name,
      lastActiveChildId:
        children.find((child) => child.originalId === this.lastActiveChildId)?.workspace.key ||
        children[0]?.workspace.key,
      children: children.map((child) => child.workspace)
    });
  }

  static deserialize(
    pref: SerializedWorkspaceGroup,
    engine: ReactorWorkspaceEngine,
    generateRootModel: () => ReactorRootWorkspaceModel
  ) {
    const id = pref.id || pref.name || v4();
    return new WorkspaceGroup({
      id,
      name: pref.name,
      lastActiveChildId: pref.lastActiveChildId,
      children: pref.children.map((child) => WorkspaceModel.deserialize(child, engine, generateRootModel, id))
    });
  }

  static fromWorkspace(
    workspace: WorkspaceModel,
    options: {
      childId: string;
      childName: string;
    }
  ) {
    const groupId = workspace.key;
    const groupName = workspace.name;
    workspace.id = options.childId;
    workspace.name = options.childName;
    return new WorkspaceGroup({
      id: groupId,
      name: groupName,
      priority: workspace.priority,
      children: [workspace],
      lastActiveChildId: workspace.key
    });
  }

  collapseToWorkspace() {
    if (this.children.length !== 1) {
      return null;
    }

    const workspace = this.children[0];
    workspace.id = this.key;
    workspace.name = this.name;
    workspace.parentId = null;
    workspace.priority = this.priority;
    return workspace;
  }
}
