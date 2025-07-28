import { WorkspaceCollectionModel, WorkspaceModel } from '@projectstorm/react-workspaces-core';
import { WorkspaceStore } from '../WorkspaceStore';
import * as _ from 'lodash';
import { ReactorPanelFactory } from '../react-workspaces/ReactorPanelFactory';
import { ReactorPanelModel } from '../react-workspaces/ReactorPanelModel';

export enum WorkspaceHint {
  COUPLED = 'COUPLED',
  ISOLATED_TRAY = 'ISOLATED_TRAY'
}

export interface AddModelsOptions {
  hint?: WorkspaceHint;
  parent?: WorkspaceCollectionModel;
  exclude?: WorkspaceModel;
}

export abstract class AbstractLayoutEngine {
  store: WorkspaceStore;

  setWorkspaceStore(store: WorkspaceStore) {
    this.store = store;
  }

  findExistingMatchingModel(input: WorkspaceModel): WorkspaceModel | null {
    let filtered = this.store.flatten(this.store.getRoot());

    // find models of the same type
    filtered = _.filter(filtered, (model) => {
      return model.type === input.type;
    });

    const factory = this.store.engine.getFactory<ReactorPanelFactory>(input);
    if (!(factory instanceof ReactorPanelFactory)) {
      console.log(`factory of type[${input.type}] is not an instance of [AbstractReactorPanelFactory]`);
      return null;
    }

    for (let model of filtered) {
      if (factory.matchesModel(input as ReactorPanelModel, model as ReactorPanelModel)) {
        return model;
      }
    }
    return null;
  }

  findMatchingModel(input: WorkspaceModel) {
    return this.findExistingMatchingModel(input) || input;
  }

  abstract addModels<T extends WorkspaceModel[]>(model: T, options?: AddModelsOptions): T;
}
