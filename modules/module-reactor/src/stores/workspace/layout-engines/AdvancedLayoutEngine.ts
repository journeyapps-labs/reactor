import * as _ from 'lodash';
import { AbstractLayoutEngine, AddModelsOptions, WorkspaceHint } from './AbstractLayoutEngine';
import { WorkspaceModel, WorkspaceNodeModel } from '@projectstorm/react-workspaces-core';
import { WorkspaceTrayMode, WorkspaceTrayModel } from '@projectstorm/react-workspaces-model-tray';
import { ReactorTabFactoryModel } from '../react-workspaces/ReactorTabFactory';
import { ReactorWindowModel } from '../react-workspaces/ReactorWindowFactory';

export class AdvancedLayoutEngine extends AbstractLayoutEngine {
  getTrays(): WorkspaceTrayModel[] {
    return _.filter(this.store.flatten(this.store.getRoot()), (model) => {
      return model instanceof WorkspaceTrayModel;
    }) as WorkspaceTrayModel[];
  }

  getTabGroupsForModel(model: WorkspaceModel, excludeTabGroups: WorkspaceModel[] = []) {
    // ######## 1. get an empty tab group
    const empty = this.store.getTabGroups().filter((t) => t.isEmpty())[0];
    if (empty) {
      return empty;
    }

    // ######## 2. find an existing tab group that has this model
    const similarModels = _.filter(this.store.flatten(this.store.getRoot()), (primary) => {
      return primary.type === model.type;
    }).filter((f) => {
      return excludeTabGroups.indexOf(f.parent) === -1;
    });

    const similarModel = _.first(similarModels);
    if (similarModel) {
      if (similarModel.parent instanceof ReactorTabFactoryModel) {
        return similarModel.parent;
      }
    }

    // ######## 3. find any tab group
    return _.first(
      this.store.getTabGroups().filter((f) => {
        return excludeTabGroups.indexOf(f) === -1;
      })
    );
  }

  /**
   * adds an expand panel to the workspace
   */
  addExpandablePanel(model: WorkspaceModel, exclude: WorkspaceModel[] = []) {
    // ######## 1. find an existing tab group that has this model
    const targetGroup = this.getTabGroupsForModel(model, exclude);
    if (targetGroup) {
      targetGroup.addModel(model);
      return true;
    }

    // ######## 2. nvm, create a new tab group and add the single model there
    this.addTabGroup().addModel(model);
    return true;
  }

  addTabGroup(): ReactorTabFactoryModel {
    const group = new ReactorTabFactoryModel();

    // ! ====== convert top level empty panels into tab groups first, before we just add any
    // these exist when new empty workspaces are created
    const emptyPanelTopLevel = _.filter(this.store.getRoot().children, (model) => {
      // tried to use the static TYPE on the factory, but there is an ioc issue
      return model.type === 'empty';
    })[0];
    if (emptyPanelTopLevel) {
      (emptyPanelTopLevel.parent as WorkspaceNodeModel).replaceModel(emptyPanelTopLevel, group);
      return group;
    }

    // ! ====== try and add a tab group after an existing tab group
    const tabs = _.filter(this.store.getRoot().children, (model) => {
      return model instanceof ReactorTabFactoryModel;
    }) as ReactorTabFactoryModel[];

    const lastTabGroup = _.last(tabs);
    if (lastTabGroup) {
      this.store.getRoot().addModelAfter(lastTabGroup, group);
      return group;
    }

    // ! ====== try and add a tab group after the first tray
    const lastTrayGroup = _.last(this.getTrays());
    if (lastTrayGroup) {
      this.store.getRoot().addModelAfter(lastTrayGroup, group);
      return group;
    }

    // ! ====== nvm just add it and be safe
    this.store.getRoot().addModel(group);
    return group;
  }

  addModelInWorkspace(model: WorkspaceModel, exclude: WorkspaceModel[] = []) {
    // replace primary model if its a full expand
    if (model.expandVertical && model.expandHorizontal) {
      if (this.addExpandablePanel(model, exclude)) {
        return true;
      }
    }

    // otherwise put it in one of the trays which has the least (but that also has less than 2)
    const trays = _.chain(this.getTrays())
      .filter((p) => p.children.length < 2)
      .sortBy((tray) => {
        return tray.children.length;
      })
      .value();
    const trayWithLeast: WorkspaceTrayModel = _.first(trays);
    if (trayWithLeast) {
      trayWithLeast.addModel(model);

      // the tray was also collapsed, so make it hover
      if (trayWithLeast.mode !== 'expand') {
        trayWithLeast.setFloatingModel(model);
      }

      return;
    }

    // hrmm, there was no tray make one and add the model

    // if the first element is an expanding model, place it on the left
    if (this.store.getRoot().children[0]?.expandHorizontal) {
      this.store.getRoot().addModel(model, 0);
    } else {
      this.store.getRoot().addModel(model);
    }
    return;
  }

  addModel(input: WorkspaceModel, exclude: WorkspaceModel[] = []) {
    const model = this.findMatchingModel(input);

    if (model === input) {
      this.addModelInWorkspace(model, exclude);
    }

    // activate the model
    this.makeModelVisible(model);
    return model;
  }

  makeModelVisible(model: WorkspaceModel) {
    if (model.parent instanceof ReactorTabFactoryModel) {
      return model.parent.setSelected(model);
    }
    if (model.parent instanceof ReactorWindowModel) {
      this.getTrays()
        .find((t) => t.children.find((c) => c === model))
        ?.setSelectedModel(model);
    }
    // if tray is collapsed, show the model
    else if (model.parent instanceof WorkspaceTrayModel) {
      if (model.parent.mode === WorkspaceTrayMode.COLLAPSED) {
        model.parent.setSelectedModel(model);
      }
    }
  }

  ensureTabs(num: number): ReactorTabFactoryModel[] {
    const tabs = this.store.getTabGroups();
    const length = tabs.length;
    if (tabs.length < num) {
      for (let i = 0; i < num - length; i++) {
        tabs.push(this.addTabGroup());
      }
    }
    return _.take(tabs, num);
  }

  addModels<T extends WorkspaceModel[]>(models: T, options: AddModelsOptions = {}): T {
    // first check for hints
    if (options.hint === WorkspaceHint.COUPLED) {
      const tabs = this.ensureTabs(models.length);
      return _.map(tabs, (tab, index) => {
        const model = this.findMatchingModel(models[index]);
        if (model === models[index]) {
          tab.addModel(model);
          tab.setSelected(model);
        } else {
          this.makeModelVisible(model);
        }
        return model;
      }) as T;
    } else if (options.hint === WorkspaceHint.ISOLATED_TRAY) {
      return _.map(models, (model) => {
        const found = this.findMatchingModel(model);
        if (found !== model) {
          this.makeModelVisible(found);
        } else {
          this.store
            .getRoot()
            .addModel(
              this.store.engine.trayFactory
                .generateModel()
                .setExpand(model.expandHorizontal, model.expandVertical)
                .setMode(WorkspaceTrayMode.COLLAPSED)
                .addModel(model)
            );
          this.makeModelVisible(model);
        }
        return found;
      }) as T;
    }
    // check to see if there is a specific parent we must use
    else if (options.parent) {
      return _.map(models, (model) => {
        const modelMatched = this.findMatchingModel(model);
        if (modelMatched === model) {
          options.parent.addModel(modelMatched);
        } else if (modelMatched.parent instanceof ReactorTabFactoryModel) {
          this.makeModelVisible(modelMatched);
        }
        return modelMatched;
      }) as T;
    }

    // add normally, but dont include the collection that this exclude model is part of
    else if (options.exclude) {
      return _.map(models, (model) => {
        let excludes = [];
        if (options.exclude instanceof ReactorTabFactoryModel) {
          excludes.push(options.exclude);
        } else if (options.exclude.parent instanceof ReactorTabFactoryModel) {
          excludes.push(options.exclude.parent);
        }
        return this.addModel(model, excludes);
      }) as T;
    }

    // just add the model normally
    return _.map(models, (model) => {
      return this.addModel(model);
    }) as T;
  }
}
