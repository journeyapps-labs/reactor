import { RootWorkspaceModel, SerializedRootWorkspaceModel } from '@projectstorm/react-workspaces-model-floating-window';
import { WorkspaceEngine, WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { ReactorWindowModel } from './ReactorWindowFactory';

export interface ReactorRootWorkspaceModelOptions {
  engine: WorkspaceEngine;
  debug?: boolean;
}

export class ReactorRootWorkspaceModel extends RootWorkspaceModel {
  replacing: boolean;

  constructor(protected options2: ReactorRootWorkspaceModelOptions) {
    super(options2.engine, options2.debug);
    this.replacing = false;
    this.setHorizontal(true);
    this.registerListener({
      visibilityChanged: () => {
        if (!this.r_visible) {
          for (let window of this.floatingWindows) {
            if (window instanceof ReactorWindowModel) {
              if (!window.pinned) {
                window.delete();
              }
            }
          }
        }
      },
      childRemoved: () => {
        if (!this.replacing && this.children.length === 0) {
          this.addModel(new WorkspaceModel('empty'));
        }
      }
    });
  }

  replaceModel(oldModel: WorkspaceModel, newModel: any): this {
    this.replacing = true;
    super.replaceModel(oldModel, newModel);
    this.replacing = false;
    return this;
  }

  toArray(): SerializedRootWorkspaceModel {
    return {
      ...super.toArray(),

      // for now dont serialize windows
      floatingWindows: []
    };
  }
}
