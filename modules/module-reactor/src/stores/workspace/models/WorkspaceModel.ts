import { WorkspaceCollectionModel, WorkspaceModel as StormWorkspaceModel } from '@projectstorm/react-workspaces-core';
import { v4 } from 'uuid';
import * as _ from 'lodash';

import type { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import type { DialogStore } from '../../DialogStore';
import { ioc } from '../../../inversify.config';
import { DialogStore2 } from '../../dialog2/DialogStore2';
import { FormDialogDirective } from '../../dialog2/directives/FormDialogDirective';
import { WorkspaceOptionsFormModel } from '../forms/WorkspaceOptionsFormModel';
import { ReactorRootWorkspaceModel } from '../react-workspaces/ReactorRootWorkspaceModel';
import { ReactorWorkspaceEngine } from '../ReactorWorkspaceEngine';
import type { WorkspaceStore } from '../WorkspaceStore';

export interface SerializedWorkspaceModel {
  id?: string;
  name: string;
  model?: any;
  parentId?: string;
  preferredOpenActions?: Record<string, string>;
}

export interface WorkspaceModelOptions {
  id?: string;
  name: string;
  model?: ReactorRootWorkspaceModel;
  parentId?: string;
  priority?: number;
  preferredOpenActions?: Record<string, string>;
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
  preferredOpenActions: Record<string, string>;

  constructor(options: WorkspaceModelOptions) {
    this.id = options.id || options.name || v4();
    this.name = options.name;
    this.model = options.model;
    this.parentId = options.parentId;
    this.priority = options.priority;
    this.preferredOpenActions = options.preferredOpenActions || {};
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

  setPreferredOpenAction(entityType: string, actionId: string | null) {
    if (actionId) {
      this.preferredOpenActions[entityType] = actionId;
    } else {
      delete this.preferredOpenActions[entityType];
    }
    return this;
  }

  getPreferredOpenAction(entityType: string): string | null {
    return this.preferredOpenActions[entityType] || null;
  }

  protected async showWorkspaceOptions(context: WorkspaceContextActionContext) {
    const form = new WorkspaceOptionsFormModel({
      preferredOpenActions: this.preferredOpenActions
    });
    await ioc.get(DialogStore2).showDialog(
      new FormDialogDirective({
        title: `${this.name} workspace options`,
        markdown: 'Choose the preferred action for opening each entity type in this workspace.',
        form,
        handler: async (form) => {
          this.preferredOpenActions = form.getPreferredOpenActions();
          context.workspaceStore.saveWorkspaceDebounced();
          context.workspaceStore.engine.fireRepaintListeners();
        }
      })
    );
  }

  getContextMenuItems(context: WorkspaceContextActionContext): ComboBoxItem[] {
    const workspaceStore = context.workspaceStore;
    const isTopLevel = workspaceStore.getTopLevelWorkspace(this.key) === this;
    const items: ComboBoxItem[] = [
      {
        key: 'workspace-options',
        icon: 'cog',
        title: 'Workspace options',
        group: 'workspace',
        action: async () => {
          await this.showWorkspaceOptions(context);
        }
      },
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
            message: `Enter the new name for workspace ${this.name}`,
            initialValue: this.name
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
      title: 'Export',
      group: 'actions',
      children: [
        {
          key: 'export-workspace',
          icon: 'upload',
          title: 'Export workspace',
          download: {
            url: workspaceStore.getExportedWorkspaceURL(this.key),
            name: 'workspace.json'
          }
        }
      ]
    });

    return items;
  }

  serialize(): SerializedWorkspaceModel {
    const preferredOpenActions = _.isEmpty(this.preferredOpenActions) ? undefined : this.preferredOpenActions;
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      model: this.model.toArray(),
      preferredOpenActions
    };
  }

  clone(options: WorkspaceModelCloneOptions) {
    const model = options.generateRootModel();
    model.fromArray(this.model.toArray(), options.engine);
    return new WorkspaceModel({
      id: options.id,
      name: options.name,
      parentId: this.parentId,
      model,
      preferredOpenActions: {
        ...this.preferredOpenActions
      }
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
      model,
      preferredOpenActions: pref.preferredOpenActions
    });
  }
}
