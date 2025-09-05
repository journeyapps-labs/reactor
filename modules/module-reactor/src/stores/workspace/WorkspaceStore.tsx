import * as _ from 'lodash';
import {
  Alignment,
  overConstrainRecomputeBehavior,
  WorkspaceCollectionModel,
  WorkspaceModel,
  WorkspaceNodeModel
} from '@projectstorm/react-workspaces-core';
import { action, autorun, IReactionDisposer, makeObservable, observable } from 'mobx';

import { ioc, inject } from '../../inversify.config';
import { AbstractLayoutEngine, AddModelsOptions } from './layout-engines/AbstractLayoutEngine';
import { AbstractStore, AbstractStoreListener } from '../AbstractStore';
import queryString from 'query-string';
import { DialogStore } from '../DialogStore';
import { MimeTypes, readFileAsText, selectFile } from '@journeyapps-labs/lib-reactor-utils';
import { PassiveActionValidationState } from '../../actions/validators/ActionValidator';
import { ReactorPanelModel } from './react-workspaces/ReactorPanelModel';
import { ReactorPanelFactory } from './react-workspaces/ReactorPanelFactory';
import { ReactorTabFactoryModel } from './react-workspaces/ReactorTabFactory';
import { ReactorWorkspaceEngine } from './ReactorWorkspaceEngine';
import { ReactorRootWorkspaceModel } from './react-workspaces/ReactorRootWorkspaceModel';
import { Btn } from '../../definitions/common';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { AdvancedLayoutEngine } from './layout-engines/AdvancedLayoutEngine';
import { SimpleLayoutEngine } from './layout-engines/SimpleLayoutEngine';
import { ReactorTrayModel } from './react-workspaces/ReactorTrayFactory';
import { WorkspaceTrayMode } from '@projectstorm/react-workspaces-model-tray';
import { LocalStorageSerializer } from '../serializers/LocalStorageSerializer';

export interface WorkspacePrefsSerialized {
  type: 'workspaces';
  version?: 1 | 2;
  models: {
    name: string;
    model: any;
  }[];
  current: string;
}

export interface ExportedWorkspace extends WorkspacePrefsSerialized {
  replace: boolean;
}

export interface IDEWorkspace {
  name: string;
  model: ReactorRootWorkspaceModel;
}

export interface GeneratedIDEWorkspace extends IDEWorkspace {
  priority?: number;
}

export interface WorkspaceStoreListener extends AbstractStoreListener {
  workspaceActivated: (workspace: IDEWorkspace) => any;
  workspaceGenerated: (model: GeneratedIDEWorkspace) => any;
  reset?: () => any;
}

interface GetPanelFactoryOptions {
  showManuallyAllowedPanels?: boolean;
  validateFactories?: boolean;
}

export interface WorkspaceGenerator {
  generateAdvancedWorkspace: () => Promise<GeneratedIDEWorkspace>;
  generateSimpleWorkspace: () => Promise<GeneratedIDEWorkspace>;
}

export class WorkspaceStore extends AbstractStore<WorkspacePrefsSerialized, WorkspaceStoreListener> {
  @observable
  accessor workspaces: IDEWorkspace[];

  @observable
  accessor currentModel: string;

  @observable
  accessor fullscreenModel: WorkspaceNodeModel;

  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  // core engines
  layoutEngine: AbstractLayoutEngine;
  engine: ReactorWorkspaceEngine;
  activatedModel: ReactorPanelModel;

  workspaceGenerators: Set<WorkspaceGenerator>;

  advancedLayoutEngine: AdvancedLayoutEngine;
  simpleLayoutEngine: SimpleLayoutEngine;

  constructor() {
    super({
      name: 'WORKSPACE',
      serializer: new LocalStorageSerializer<WorkspacePrefsSerialized>({
        key: 'WORKSPACE_PREFS'
      })
    });
    this.workspaces = [];
    this.engine = new ReactorWorkspaceEngine();
    this.engine.registerListener({
      layoutInvalidated: () => {
        this.saveWorkspaceDebounced();
      },
      dimensionsInvalidated: () => {
        this.saveWorkspaceDebounced();
      }
    });
    this.currentModel = null;
    this.activatedModel = null;
    this.fullscreenModel = null;
    this.workspaceGenerators = new Set();
    this.simpleLayoutEngine = new SimpleLayoutEngine();
    this.advancedLayoutEngine = new AdvancedLayoutEngine();

    let listener: () => any;
    autorun(() => {
      listener?.();
      if (this.currentModel) {
        listener = overConstrainRecomputeBehavior({
          engine: this.engine
        });
      }
    });
  }

  switchLayoutEngine(advanced: boolean) {
    if (advanced) {
      this.setWorkspaceLayoutEngine(this.advancedLayoutEngine);
    } else {
      this.setWorkspaceLayoutEngine(this.simpleLayoutEngine);
    }
  }

  saveWorkspaceDebounced = _.debounce(() => {
    this.logger.debug('workspace updated');
    this.save();
  }, 1000);

  generateFullscreenButton(model: WorkspaceModel): Btn {
    const isFullscreen = this.fullscreenModel;
    return {
      icon: isFullscreen ? 'compress' : 'expand',
      tooltip: isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen',
      action: () => {
        ioc.get(WorkspaceStore).setFullscreenModel(isFullscreen ? null : model);
      }
    };
  }

  setFullscreenModel(model: WorkspaceModel | null) {
    if (model !== null) {
      const root = this.generateRootModel();
      const cloned = this.engine.getFactory(model.type).generateModel();
      cloned.fromArray(model.toArray(), this.engine);
      root.addModel(cloned);
      this.fullscreenModel = root;
    } else {
      this.fullscreenModel = null;
    }
    this.engine.fireRepaintListeners();
  }

  protected activateWorkspace(name: string) {
    // safety check
    if (!this.workspaces.find((w) => w.name === name)) {
      throw new Error(`Failed to activate workspace ${name}`);
    }

    this.currentModel = name;
    this.iterateListeners((l) => {
      if (l.workspaceActivated) {
        l.workspaceActivated(this.getWorkspace(this.currentModel));
      }
    });
  }

  async setActiveWorkspace(name: string) {
    if (this.fullscreenModel) {
      this.setFullscreenModel(null);
    }
    this.activateWorkspace(name);
    await this.save();
  }

  setWorkspaceLayoutEngine(engine: AbstractLayoutEngine) {
    engine.setWorkspaceStore(this);
    this.layoutEngine = engine;
  }

  getIDEWorkspace(id: string): IDEWorkspace {
    for (let workspace of this.workspaces) {
      if (workspace.model.id === id) {
        return workspace;
      }
    }
    return null;
  }

  registerWorkspaces(model: IDEWorkspace) {
    this.workspaces.push(model);
    if (!this.currentModel) {
      this.setActiveWorkspace(model.name);
    }
  }

  registerFactory(factory: ReactorPanelFactory) {
    this.engine.addReactorPanelFactory(factory);
  }

  walk(root: WorkspaceModel, cb: (model: WorkspaceModel) => any) {
    cb(root);
    if (root instanceof WorkspaceCollectionModel) {
      for (let model of root.children) {
        this.walk(model, cb);
      }
    }
  }

  flatten(root: WorkspaceNodeModel): WorkspaceModel[] {
    let models = [];
    this.walk(root, (model) => {
      models.push(model);
    });
    return models;
  }

  getTabGroups() {
    return _.filter(this.flatten(this.getRoot()), (model) => {
      return model instanceof ReactorTabFactoryModel;
    }) as ReactorTabFactoryModel[];
  }

  getPanelFactories(opts: GetPanelFactoryOptions = {}): ReactorPanelFactory[] {
    opts = {
      ...opts,
      showManuallyAllowedPanels: opts.showManuallyAllowedPanels == null ? true : opts.showManuallyAllowedPanels
    };

    return _.filter(this.engine.factories, (factory) => {
      // only reactor factories
      if (!(factory instanceof ReactorPanelFactory)) {
        return false;
      }

      if (opts.validateFactories && factory.options.validators) {
        if (
          factory.options.validators.some(
            (validation) => validation.validate().type == PassiveActionValidationState.DISALLOWED
          )
        ) {
          return false;
        }
      }

      // some panels are not allowed to be manually created
      if (!opts.showManuallyAllowedPanels) {
        return factory.options.allowManualCreation;
      }
      return true;
    }) as ReactorPanelFactory[];
  }

  findModel(root: WorkspaceNodeModel, id: string): WorkspaceModel {
    return _.find(this.flatten(root), { id: id });
  }

  getRoot(): ReactorRootWorkspaceModel {
    const model = _.find(this.workspaces, { name: this.currentModel });
    if (!model) {
      return null;
    }
    return model.model;
  }

  hasOne(factory: ReactorPanelFactory): boolean {
    return _.some(this.flatten(this.getRoot()), (model) => {
      return model.type === factory.type;
    });
  }

  addModels<T extends WorkspaceModel[]>(input: T, options: AddModelsOptions = {}): T {
    return this.layoutEngine.addModels(input, options);
  }

  addModel<T extends WorkspaceModel>(input: T): T {
    return this.layoutEngine.addModels([input])[0];
  }

  addModelInWindow(input: WorkspaceModel, options: { position?: Alignment; width: number; height: number }) {
    const m = this.engine.generateStandaloneWindowModel();

    const PADDING = 20;
    const W = options.width;
    const H = options.height;
    const dims = this.getRoot().r_dimensions;

    if (options.position === Alignment.BOTTOM) {
      m.position.update({
        top: dims.dimensions.height - H - PADDING,
        left: dims.dimensions.width / 2 - W / 2
      });
    } else {
      m.position.update({
        top: dims.dimensions.height / 2 - H / 2,
        left: dims.dimensions.width / 2 - W / 2
      });
    }

    m.setSize({
      width: W,
      height: H
    });

    m.setChild(input);
    this.getRoot().addFloatingWindow(m);
  }

  registerWorkspaceGenerator(generator: WorkspaceGenerator) {
    this.workspaceGenerators.add(generator);
  }

  @action
  async reset() {
    const currentModel = this.currentModel;
    this.workspaces = [];
    this.currentModel = null;

    const generated = await Promise.all(
      Array.from(this.workspaceGenerators.values()).map(async (generator) => {
        let model: GeneratedIDEWorkspace = null;
        if (AdvancedWorkspacePreference.enabled()) {
          model = await generator.generateAdvancedWorkspace();
        } else {
          model = await generator.generateSimpleWorkspace();
        }
        if (model) {
          this.iterateListeners((cb) => cb.workspaceGenerated?.(model));
        }
        return model;
      })
    );

    // highest priority first
    const sorted = generated
      .filter((f) => !!f)
      .sort((a, b) => {
        return (b.priority || 0) - (a.priority || 0);
      });

    for (let w of sorted) {
      this.registerWorkspaces(w);
    }

    this.iterateListeners((listener) => {
      listener.reset?.();
    });

    const existing = this.workspaces.find((w) => w.name === currentModel);

    // reset back to current model if it exists, else reset
    await this.setActiveWorkspace(!!existing ? currentModel : this.workspaces[0].name);
    setTimeout(() => {
      this.engine.fireRepaintListeners();
    }, 500);
  }

  getActivePanelHash() {
    if (this.activatedModel) {
      const res = _.omit(this.activatedModel.toArray(), ['id', 'expandHorizontal', 'expandVertical']);
      return queryString.stringify(res);
    }
    return '';
  }

  async activatePanel(model: ReactorPanelModel) {
    this.activatedModel = model;
  }

  async hydratePanelFromURL() {
    if (window.location.hash) {
      const query = queryString.parse(window.location.hash);
      if (query?.type) {
        const model = this.engine.getFactory(query.type as string).generateModel();
        model.fromArray(
          {
            ...(query as any),
            expandHorizontal: model.expandHorizontal,
            expandVertical: model.expandVertical
          },
          this.engine
        );
        this.addModel(model);
      }
    }
  }

  async init(): Promise<boolean> {
    this.currentModel = null;
    const success = await super.init();
    if (!success) {
      await this.reset();
    }

    this.engine.invalidateLayoutDebounced();
    return success;
  }

  protected serialize(): WorkspacePrefsSerialized {
    return {
      type: 'workspaces',
      models: _.map(this.workspaces, (model) => {
        return {
          ...model,
          model: model.model.toArray()
        };
      }),
      version: 2,
      current: this.currentModel
    };
  }

  protected async deserialize(data: WorkspacePrefsSerialized) {
    try {
      this.workspaces = this.convertSerializedToModels(data);
      await this.setActiveWorkspace(data.current);
    } catch (ex) {
      this.reset();
    }
  }

  protected convertSerializedToModels(data: WorkspacePrefsSerialized): IDEWorkspace[] {
    // legacy
    if (!data.version) {
      data.version = 1;
    }

    // patch version 1
    if (data.version === 1) {
      data = this.patch_v1(data);
    }

    try {
      return _.map(data.models, (pref) => {
        const m = this.generateRootModel();
        m.fromArray(pref.model, this.engine);
        m.flatten().forEach((m) => {
          if (m instanceof WorkspaceCollectionModel) {
            m.normalize();
          }
        });
        return {
          name: pref.name,
          model: m
        };
      });
    } catch (ex) {
      console.error('could not reload workspace', ex);
    }
    return [];
  }

  protected patch_v1(data: WorkspacePrefsSerialized) {
    const patchCollection = (model) => {
      if (model.type === 'srw-node') {
        this.logger.info('Detected legacy workspace');
        // old trays -> new trays
        if (!model.expandHorizontal && model.expandVertical) {
          model.type = ReactorTrayModel.NAME;
          model.mode = model.mode === 'micro' ? WorkspaceTrayMode.COLLAPSED : WorkspaceTrayMode.NORMAL;
        }
        model.children = model.children.map((c) => {
          return patchCollection(c);
        });
      }
      return model;
    };

    data.models = data.models.map((model) => {
      return {
        ...model,
        ...patchCollection(model.model)
      };
    });

    return data;
  }

  @action deleteWorkspace(name: string) {
    if (this.workspaces.length === 1) {
      return;
    }
    const index = _.findIndex(this.workspaces, { name: name });
    if (index !== -1) {
      this.workspaces.splice(index, 1);
      this.currentModel = _.last(this.workspaces).name;
      this.save();
    }
  }

  async importWorkspace(): Promise<boolean> {
    const file = await selectFile({
      mimeTypes: [MimeTypes.A_JSON, MimeTypes.T_JSON]
    });
    if (!file) {
      return;
    }
    const textFromFileLoaded = await readFileAsText(file);
    // try to decode workspaces
    try {
      const decoded: ExportedWorkspace = JSON.parse(textFromFileLoaded);
      if (!Array.isArray(decoded.models)) {
        await this.dialogStore.showErrorDialog({
          title: 'Failed to import workspaces',
          message: 'The target file is missing data, try export the workspaces again'
        });
        return false;
      }

      const finalModels = this.convertSerializedToModels(decoded);
      if (decoded.replace) {
        this.workspaces = finalModels;
        this.currentModel = _.first(decoded.models).name;
      } else {
        this.workspaces = this.workspaces.concat(
          finalModels.map((model) => {
            return {
              ...model,

              // ensure there are no duplicates
              name: this.getSafeWorkspaceName(model.name)
            };
          })
        );
      }
      await this.save();
      return true;
    } catch (ex) {
      console.error(ex);
      await this.dialogStore.showErrorDialog({
        title: 'Failed to import workspaces',
        message:
          'The target file is not valid JSON, it was probably tampered with or has changed encoding through transmission.'
      });
    }
  }

  getExportedWorkspaceURL(name: string) {
    const workspace = this.getWorkspace(name);
    return URL.createObjectURL(
      new Blob([
        JSON.stringify({
          type: 'workspaces',
          replace: false,
          current: name,
          models: [
            {
              model: workspace.model.toArray(),
              name: name
            }
          ]
        } as ExportedWorkspace)
      ])
    ).toString();
  }

  getExportedWorkspacesURL() {
    return URL.createObjectURL(
      new Blob([
        JSON.stringify({
          type: 'workspaces',
          replace: true,
          current: _.first(this.workspaces).name,
          models: this.workspaces.map((w) => {
            return {
              model: w.model.toArray(),
              name: w.name
            };
          })
        } as ExportedWorkspace)
      ])
    ).toString();
  }

  generateRootModel() {
    return new ReactorRootWorkspaceModel({
      engine: this.engine
    });
  }

  getWorkspace(name: string): IDEWorkspace {
    return _.find(this.workspaces, { name: name });
  }

  getSafeWorkspaceName(name: string): string {
    let index = 1;
    let workspace = null;
    let newName = `${name}`;
    do {
      workspace = this.getWorkspace(newName);
      if (!workspace) {
        return newName;
      }
      index++;
      newName = `${name} ${index}`;
    } while (workspace);
  }

  @action cloneWorkspace(name: string, key: string) {
    name = this.getSafeWorkspaceName(name);
    const model = this.generateRootModel();
    model.fromArray(this.getWorkspace(key).model.toArray(), this.engine);
    this.workspaces.push({
      name: name,
      model: model
    });
    this.currentModel = name;
    this.save();
  }

  @action renameWorkspace(name: string, key: string) {
    name = this.getSafeWorkspaceName(name);
    const workspace = this.getWorkspace(key);
    workspace.name = name;
    this.currentModel = name;
    this.save();
  }

  @action
  async newWorkspace(name: string) {
    name = this.getSafeWorkspaceName(name);
    const model = this.generateRootModel();
    model.addModel(new WorkspaceModel('empty'));
    this.workspaces.push({
      name: name,
      model: model
    });
    await this.setActiveWorkspace(name);
    await this.save();
  }
}
