import { action, observable } from 'mobx';
import * as _ from 'lodash';
import { AbstractInteractiveSetting } from '../settings/AbstractInteractiveSetting';
import { AbstractStore } from './AbstractStore';
import { LocalStorageSerializer } from './serializers/LocalStorageSerializer';
import { AbstractSetting } from '../settings/AbstractSetting';

export interface PrefsSerialized {
  controls: {
    [key: string]: object;
  };
}

export class PrefsCategory {
  key: string;
  name: string;
  generateUI: () => React.JSX.Element;
}

export enum PrefsCatgories {
  USER_SETTINGS = 'user',
  KEYBOARD_SHORTCUTS = 'shortcuts',
  THEMES = 'themes'
}

export class PrefsStore extends AbstractStore<PrefsSerialized> {
  @observable
  protected accessor controls: { [key: string]: AbstractSetting };

  categories: { [key: string]: PrefsCategory };

  constructor() {
    super({
      name: 'PREFERENCES',
      serializer: new LocalStorageSerializer({
        key: 'IDE_PREFS'
      })
    });
    this.categories = {};
    this.controls = {};
  }

  registerPreferenceCategory(category: PrefsCategory) {
    this.categories[category.key] = category;
  }

  getInteractiveControls(): AbstractInteractiveSetting[] {
    return _.filter(this.controls, (control) => {
      return control instanceof AbstractInteractiveSetting;
    }) as AbstractInteractiveSetting[];
  }

  registerPreference(pref: AbstractSetting) {
    this.controls[pref.options.key] = pref;
    pref.registerListener({
      updated: () => {
        this.save();
      }
    });
  }

  getPreference<T extends AbstractSetting>(key: string): T {
    if (!this.controls[key]) {
      throw new Error(`Cant find preference with key: [${key}]`);
    }
    return this.controls[key] as T;
  }

  serialize(): PrefsSerialized {
    const prefs = {
      controls: _.reduce(
        this.controls,
        (prefs, control) => {
          prefs[control.options.key] = control.doSerialize();
          return prefs;
        },
        {}
      )
    };
    this.logger.debug('Saving prefs payload', prefs);
    return prefs;
  }

  async deserialize(data: PrefsSerialized) {
    _.forEach(this.controls, (control: AbstractSetting) => {
      if (data.controls[control.options.key] !== undefined) {
        control.doDeserialize(data.controls[control.options.key]);
      }
    });
  }

  @action
  async reset() {
    for (let control of _.values(this.controls)) {
      try {
        await control.reset();
      } catch (ex) {
        this.logger.error('could not reset preferences', ex);
      }
    }
    await this.save();
  }

  async init() {
    await super.init();

    // initialize all the preferences
    _.forEach(this.controls, (preference) => {
      preference.init();
    });
    return true;
  }
}
