import { WorkspaceStore } from '../workspace/WorkspaceStore';
import * as _ from 'lodash';
import { ComponentSelection } from './selections/ComponentSelection';
import { GuideWorkflow } from './GuideWorkflow';
import { makeObservable, observable } from 'mobx';
import { AbstractStore, AbstractStoreListener } from '../AbstractStore';

export interface SelectIdentifier {
  panelFactoryType?: string;
  label?: string;
  type: string;
}

export interface VisibleComponentIdentifier<
  S extends any = any,
  T extends ComponentSelection<S> = ComponentSelection<S>
> {
  selection: S;
  id: string;
  type: string;
  generate: (selection: T) => any;
}

export interface GuideStoreParams {
  workspaceStore: WorkspaceStore;
}

export interface GuideStoreListener extends AbstractStoreListener {
  guideActivated: (event: { guide: GuideWorkflow }) => any;
}

export class GuideStore extends AbstractStore<{}, GuideStoreListener> {
  visibleComponents: { [id: string]: VisibleComponentIdentifier };

  workspaceStore: WorkspaceStore;
  guideWorkflows: GuideWorkflow[];

  @observable
  private accessor currentGuide: GuideWorkflow;

  @observable
  accessor selections: { [id: string]: ComponentSelection };

  selectionDirectives: {
    [id: string]: {
      directive: SelectIdentifier;
      resolve: (t: ComponentSelection) => any;
    };
  };

  workspaceListener: () => any;

  constructor(params: GuideStoreParams) {
    super({
      name: 'GUIDE_STORE'
    });
    this.visibleComponents = {};
    this.selectionDirectives = {};
    this.workspaceStore = params.workspaceStore;
    this.guideWorkflows = [];
    this.currentGuide = null;
    this.workspaceListener = null;
    this.selections = {};
  }

  getCurrentGuide<T extends GuideWorkflow>(): T {
    return this.currentGuide as T;
  }

  unregisterVisibleComponent(id: string) {
    if (!this.visibleComponents[id]) {
      return false;
    }
    this.logger.debug(`Unregistering ${this.visibleComponents[id]?.type}`);
    this.selections[id]?.dispose();
    delete this.visibleComponents[id];
  }

  registerVisibleComponent(component: VisibleComponentIdentifier) {
    if (this.visibleComponents[component.id]) {
      return;
    }
    this.visibleComponents[component.id] = component;
    this.logger.debug(`Registering ${component.type}`, component.selection);

    for (let id in this.selections) {
      const selection = this.selections[id];
      if (selection.matches(component)) {
        component.generate(selection);
      }
    }
  }

  clearSelectionDirective(directive: SelectIdentifier) {
    for (let i in this.selectionDirectives) {
      if (_.isEqual(this.selectionDirectives[i].directive, directive)) {
        delete this.selectionDirectives[i];
      }
    }
  }

  registerGuideWorkflow(guide: GuideWorkflow) {
    guide.setGuideStore(this);
    this.workspaceListener = guide.registerListener({
      activated: () => {
        this.currentGuide = guide;
        this.iterateListeners((cb) =>
          cb.guideActivated?.({
            guide: guide
          })
        );
      },
      deActivated: () => {
        this.currentGuide = null;
      }
    });
    this.guideWorkflows.push(guide);
  }

  select(identifier: ComponentSelection) {
    this.selections[identifier.id] = identifier;
    let found = false;
    for (let id in this.visibleComponents) {
      const vis = this.visibleComponents[id];
      if (identifier.matches(vis)) {
        found = true;
        vis.generate(identifier);
      }
    }
    if (!found) {
      this.logger.debug('Could not find: ', identifier.options.type);
    }

    identifier.registerListener({
      deactivated: () => {
        delete this.selections[identifier.id];
      }
    });
  }
}
