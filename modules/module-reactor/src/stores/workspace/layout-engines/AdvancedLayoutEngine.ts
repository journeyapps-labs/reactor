import * as _ from 'lodash';
import { AbstractLayoutEngine, AddModelsOptions, WorkspaceHint } from './AbstractLayoutEngine';
import { WorkspaceModel, WorkspaceNodeModel } from '@projectstorm/react-workspaces-core';
import { WorkspaceTrayMode, WorkspaceTrayModel } from '@projectstorm/react-workspaces-model-tray';
import { ReactorTabFactoryModel } from '../react-workspaces/ReactorTabFactory';
import { ReactorWindowModel } from '../react-workspaces/ReactorWindowFactory';

interface AdvancedWorkspaceLayout {
  children: WorkspaceModel[];
  emptyPanel: WorkspaceModel;
  tabGroups: ReactorTabFactoryModel[];
  emptyTabGroups: ReactorTabFactoryModel[];
  availableTrays: WorkspaceTrayModel[];
  similarPanel?: WorkspaceModel;
  tabGroupInsertIndex: number;
  shrinkModelInsertIndex: number;
}

export class AdvancedLayoutEngine extends AbstractLayoutEngine {
  getTrays(): WorkspaceTrayModel[] {
    return _.filter(this.store.flatten(this.store.getRoot()), (model) => {
      return model instanceof WorkspaceTrayModel;
    }) as WorkspaceTrayModel[];
  }

  isShrinkModel(model: WorkspaceModel) {
    return model instanceof WorkspaceTrayModel || !model.expandHorizontal;
  }

  isPanelModel(model: WorkspaceModel) {
    return !(model instanceof WorkspaceTrayModel) && !(model instanceof ReactorTabFactoryModel);
  }

  isEmptyTabGroup(model: ReactorTabFactoryModel) {
    return model.children.length === 0 || model.children.every((child) => child.type === 'empty');
  }

  getLayout(model?: WorkspaceModel) {
    const children = this.store.getRoot().children;
    const models = this.store.flatten(this.store.getRoot());
    const firstContentIndex = children.findIndex((model) => !this.isShrinkModel(model));
    const lastContentIndex = _.findLastIndex(children, (model) => !this.isShrinkModel(model));
    const tabGroups = children.filter((model) => model instanceof ReactorTabFactoryModel) as ReactorTabFactoryModel[];
    const lastTabGroup = _.last(tabGroups);
    const rightShrinkCount = lastContentIndex === -1 ? 0 : children.length - lastContentIndex - 1;

    return {
      children,
      emptyPanel: children.find((model) => model.type === 'empty'),
      tabGroups,
      emptyTabGroups: tabGroups.filter((tab) => this.isEmptyTabGroup(tab)),
      availableTrays: _.chain(this.getTrays())
        .filter((tray) => tray.children.length < 2)
        .sortBy((tray) => tray.children.length)
        .value(),
      similarPanel: model
        ? models.find((child) => {
            return child.type === model.type && child !== model && this.isPanelModel(child);
          })
        : undefined,
      tabGroupInsertIndex: lastTabGroup ? children.indexOf(lastTabGroup) + 1 : children.length - rightShrinkCount,
      shrinkModelInsertIndex:
        firstContentIndex === -1 ? children.length : firstContentIndex > 0 ? lastContentIndex + 1 : 0
    } satisfies AdvancedWorkspaceLayout;
  }

  addModelToSimilarPanel(model: WorkspaceModel, layout: AdvancedWorkspaceLayout) {
    const existing = layout.similarPanel;
    if (!existing) {
      return false;
    }

    if (existing.parent instanceof ReactorTabFactoryModel) {
      existing.parent.addModel(model);
      existing.parent.setSelected(model);
      return true;
    }

    if (existing.parent instanceof WorkspaceTrayModel) {
      existing.parent.addModel(model);
      if (existing.parent.mode !== 'expand') {
        existing.parent.setFloatingModel(model);
      }
      return true;
    }

    const group = new ReactorTabFactoryModel();
    (existing.parent as WorkspaceNodeModel).replaceModel(existing, group);
    group.addModel(existing);
    group.addModel(model);
    return true;
  }

  getTabGroupsForModel(model: WorkspaceModel, excludeTabGroups: WorkspaceModel[] = []) {
    const layout = this.getLayout();

    // ######## 1. get an empty tab group
    if (layout.emptyTabGroups.length > 0) {
      return _.first(layout.emptyTabGroups);
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
      layout.tabGroups.filter((f) => {
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
    const layout = this.getLayout();

    // ! ====== convert top level empty panels into tab groups first, before we just add any
    // these exist when new empty workspaces are created
    if (layout.emptyPanel) {
      (layout.emptyPanel.parent as WorkspaceNodeModel).replaceModel(layout.emptyPanel, group);
      return group;
    }

    this.store.getRoot().addModel(group, layout.tabGroupInsertIndex);
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
    const layout = this.getLayout(model);

    const emptyTabGroup = _.first(layout.emptyTabGroups);
    if (emptyTabGroup) {
      emptyTabGroup.addModel(model);
      return true;
    }

    if (this.addModelToSimilarPanel(model, layout)) {
      return true;
    }

    const trayWithLeast: WorkspaceTrayModel = _.first(layout.availableTrays);
    if (trayWithLeast) {
      trayWithLeast.addModel(model);

      // the tray was also collapsed, so make it hover
      if (trayWithLeast.mode !== 'expand') {
        trayWithLeast.setFloatingModel(model);
      }

      return;
    }

    // hrmm, there was no tray make one and add the model
    this.store.getRoot().addModel(model, layout.shrinkModelInsertIndex);
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
    const layout = this.getLayout();
    const tabs = _.uniq([...layout.emptyTabGroups, ...layout.tabGroups]);
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
