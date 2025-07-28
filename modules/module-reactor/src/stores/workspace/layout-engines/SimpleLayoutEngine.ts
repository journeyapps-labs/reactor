import { AbstractLayoutEngine, AddModelsOptions } from './AbstractLayoutEngine';
import { WorkspaceCollectionModel, WorkspaceModel } from '@projectstorm/react-workspaces-core';

export type AffinityChecker = {
  factoryType: string;
  checker: (model: WorkspaceModel) => string | null;
};

export class SimpleLayoutEngine extends AbstractLayoutEngine {
  affinityCheckers: Set<AffinityChecker>;

  constructor() {
    super();
    this.affinityCheckers = new Set();
  }

  registerModelAffinity(cb: AffinityChecker) {
    this.affinityCheckers.add(cb);
  }

  getWorkspaceForModel(model: WorkspaceModel) {
    const checkers = Array.from(this.affinityCheckers).filter((checker) => checker.factoryType === model.type);
    for (let checker of checkers) {
      let root = checker.checker(model);
      if (root) {
        return root;
      }
    }

    // fallback to current workspace
    return this.store.currentModel;
  }

  addModels<T extends WorkspaceModel[]>(models: T, options?: AddModelsOptions): T {
    for (let model of models) {
      const workspaceName = this.getWorkspaceForModel(model);

      this.store.setActiveWorkspace(workspaceName);

      const flattened = this.store.getRoot().flatten();

      // 1. find the exact place this should go
      let modelThatCanBeReplaced = flattened.find((existingModel) => {
        // always use an empty panel if possible
        if (existingModel.type === 'empty') {
          return existingModel;
        }
        return models.map((m) => m.id).indexOf(existingModel.id) === -1 && existingModel.type === model.type;
      });

      // 2. otherwise find something with the same sizing directive
      modelThatCanBeReplaced =
        modelThatCanBeReplaced ||
        flattened.find((m) => {
          // don't replace thin panels
          if (!m.expandHorizontal) {
            return false;
          }
          return !(m instanceof WorkspaceCollectionModel) && m.expandHorizontal === model.expandHorizontal;
        });

      // 3. open it in a window instead
      if (!modelThatCanBeReplaced) {
        this.store.addModelInWindow(model, { width: 250, height: 200 });
        continue;
      }

      // finally do the replacement
      if (modelThatCanBeReplaced.parent instanceof WorkspaceCollectionModel) {
        modelThatCanBeReplaced.parent.replaceModel(modelThatCanBeReplaced, model);
      }
    }
    return models;
  }
}
