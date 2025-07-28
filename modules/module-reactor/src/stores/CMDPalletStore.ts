import { CMDPalletSearchEngine } from '../cmd-pallet/CMDPalletSearchEngine';
import { makeObservable, observable } from 'mobx';
import { Action, ActionEvent } from '../actions/Action';
import { ioc, inject } from '../inversify.config';
import { System } from '../core/System';
import * as _ from 'lodash';
import { keyType, ShortcutChord } from './shortcuts/Shortcut';

export interface CMDPalletSearchEngineCategory {
  engines: CMDPalletSearchEngine[];
  name: string;
  hotkeys: ShortcutChord[];
}

export class OpenCMDPalletAction extends Action {
  store: CMDPalletStore;
  category: CMDPalletSearchEngineCategory;

  constructor(category: CMDPalletSearchEngineCategory, store: CMDPalletStore) {
    super({
      id: `COMMAND_PALLET:${category.name.toUpperCase()}`,
      hotkeys: category.hotkeys,
      name: `CMDPallet:${category.name}`,
      icon: 'bolt',
      exemptFromExclusiveExecutionLock: true
    });
    this.store = store;
    this.category = category;
  }

  protected async fireEvent(event: ActionEvent): Promise<any> {
    return this.store.showPalletCategory(this.category.name);
  }
}

/**
 * Store for working with and managing the command palette
 */
export class CMDPalletStore {
  protected categories: { [key: string]: CMDPalletSearchEngineCategory };

  @observable
  accessor show: string;

  static EVERYTHING = 'Everything';

  @inject(System)
  accessor system: System;

  constructor() {
    this.categories = {};
    this.show = null;
    this.registerCategory({
      engines: [],
      hotkeys: [
        new ShortcutChord([{ type: keyType.META }, { type: keyType.SHIFT }, { type: keyType.STANDARD, key: 'p' }]),
        new ShortcutChord([{ type: keyType.CTRL }, { type: keyType.SHIFT }, { type: keyType.STANDARD, key: 'p' }]),
        new ShortcutChord([{ type: keyType.SHIFT }], [{ type: keyType.SHIFT }])
      ],
      name: CMDPalletStore.EVERYTHING
    });
  }

  getDefaultCategory() {
    return this.categories[CMDPalletStore.EVERYTHING];
  }

  getCategories(): CMDPalletSearchEngineCategory[] {
    return _.values(this.categories);
  }

  getSearchEngines(category: string): CMDPalletSearchEngine[] {
    const cat = _.find(this.categories, { name: category });
    if (!cat) {
      console.error('cant find cmd pallet category, ', category);
      return [];
    }
    return _.orderBy(cat.engines, (e) => e.options.priority || 0).reverse();
  }

  showPallet(show: boolean = true) {
    this.show = show ? CMDPalletStore.EVERYTHING : null;
  }

  showPalletCategory(show: string) {
    this.show = show;
  }

  registerSearchEngine(engine: CMDPalletSearchEngine) {
    this.getDefaultCategory().engines.push(engine);
  }

  registerCategory(category: CMDPalletSearchEngineCategory) {
    this.categories[category.name] = category;
  }

  generateActions(): Action[] {
    return _.map(this.categories, (category) => {
      return new OpenCMDPalletAction(category, this);
    });
  }

  init() {
    this.generateActions().forEach((action) => {
      ioc.get(System).registerAction(action);
    });
  }
}
