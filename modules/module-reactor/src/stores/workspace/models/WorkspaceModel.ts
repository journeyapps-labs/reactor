import { WorkspaceCollectionModel, WorkspaceModel as StormWorkspaceModel } from '@projectstorm/react-workspaces-core';
import { v4 } from 'uuid';

import type { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import type { DialogStore } from '../../DialogStore';
import { ReactorRootWorkspaceModel } from '../react-workspaces/ReactorRootWorkspaceModel';
import { ReactorWorkspaceEngine } from '../ReactorWorkspaceEngine';
import type { WorkspaceStore } from '../WorkspaceStore';

export interface SerializedWorkspaceModel {
  id?: string;
  name: string;
  model?: any;
  parentId?: string;
}

export interface WorkspaceModelOptions {
  id?: string;
  name: string;
  model?: ReactorRootWorkspaceModel;
  parentId?: string;
  priority?: number;
}

export interface WorkspaceActivation {
  topWorkspace: WorkspaceModel;
  workspace: WorkspaceModel;
}

export interface WorkspaceModelCloneOptions {
  id: string;
  name: string;
  engine: ReactorWorkspaceEngine;
  generateRootModel: () => ReactorRootWorkspaceModel;
}

export interface WorkspaceContextActionContext {
  workspaceStore: WorkspaceStore;
  dialogStore: DialogStore;
}

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export class WorkspaceModel {
  id: string;
  name: string;
  model?: ReactorRootWorkspaceModel;
  parentId?: string;
  priority?: number;

  constructor(options: WorkspaceModelOptions) {
    this.id = options.id || options.name || v4();
    this.name = options.name;
    this.model = options.model;
    this.parentId = options.parentId;
    this.priority = options.priority;
  }

  get key() {
    return this.id || this.name;
  }

  isGroup(): boolean {
    return false;
  }

  getAllWorkspaces(): WorkspaceModel[] {
    return [this];
  }

  getChildren(): WorkspaceModel[] {
    return [];
  }

  contains(key: string): boolean {
    return this.key === key;
  }

  activate(): WorkspaceActivation {
    return {
      topWorkspace: this,
      workspace: this
    };
  }

  getContextMenuItems(context: WorkspaceContextActionContext): ComboBoxItem[] {
    const workspaceStore = context.workspaceStore;
    const isTopLevel = workspaceStore.getTopLevelWorkspace(this.key) === this;
    const items: ComboBoxItem[] = [
      {
        key: 'delete',
        icon: 'trash',
        title: 'Delete workspace',
        group: 'workspace',
        action: async () => {
          context.workspaceStore.deleteWorkspace(this.key);
        }
      },
      {
        key: 'clone',
        icon: 'clone',
        title: 'Clone workspace',
        group: 'workspace',
        action: async () => {
          const name = await context.dialogStore.showInputDialog({
            title: 'Clone workspace',
            message: 'Enter the name for this cloned workspace'
          });
          if (name) {
            context.workspaceStore.cloneWorkspace(capitalize(name), this.key);
          }
        }
      },
      {
        key: 'rename',
        icon: 'i-cursor',
        title: 'Rename workspace',
        group: 'workspace',
        action: async () => {
          const name = await context.dialogStore.showInputDialog({
            title: 'Rename workspace',
            message: `Enter the new name for workspace ${this.name}`
          });
          if (name) {
            context.workspaceStore.renameWorkspace(capitalize(name), this.key);
          }
        }
      }
    ];

    if (isTopLevel) {
      items.push({
        key: 'convert-group',
        icon: 'layer-group',
        title: 'Convert to group',
        group: 'workspace',
        action: async () => {
          await context.workspaceStore.convertWorkspaceToGroup(this.key);
        }
      });
    }

    items.push({
      key: 'export',
      icon: 'upload',
      title: 'Export workspace',
      group: 'actions',
      download: {
        url: workspaceStore.getExportedWorkspaceURL(this.key),
        name: 'workspace.json'
      }
    });

    return items;
  }

  serialize(): SerializedWorkspaceModel {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      model: this.model.toArray()
    };
  }

  clone(options: WorkspaceModelCloneOptions) {
    const model = options.generateRootModel();
    model.fromArray(this.model.toArray(), options.engine);
    return new WorkspaceModel({
      id: options.id,
      name: options.name,
      parentId: this.parentId,
      model
    });
  }

  cloneForImport(options: WorkspaceModelCloneOptions) {
    return this.clone(options);
  }

  static deserialize(
    pref: SerializedWorkspaceModel,
    engine: ReactorWorkspaceEngine,
    generateRootModel: () => ReactorRootWorkspaceModel,
    parentId?: string
  ) {
    const model = generateRootModel();
    model.fromArray(pref.model, engine);
    model.flatten().forEach((child: StormWorkspaceModel) => {
      if (child instanceof WorkspaceCollectionModel) {
        child.normalize();
      }
    });
    return new WorkspaceModel({
      id: pref.id || (parentId ? v4() : pref.name) || v4(),
      name: pref.name,
      parentId,
      model
    });
  }
}
