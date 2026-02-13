import { EntityDescriberComponent } from './EntityDescriberComponent';
import { AbstractSetting } from '../../../settings/AbstractSetting';
import { SetSetting } from '../../../settings/SetSetting';
import type { EntityDefinition } from '../../EntityDefinition';
import { inject } from '../../../inversify.config';
import { PrefsStore } from '../../../stores/PrefsStore';

export class EntityDescriberBank<T = any> {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  private describers: EntityDescriberComponent<T>[];
  private preferredSetting: SetSetting;

  constructor(private definition: EntityDefinition<T>) {
    this.describers = [];
    this.preferredSetting = new SetSetting({
      key: `/entities/${this.definition.type}/visual/preferred-describer`,
      serializeID: 'v1',
      name: `${this.definition.label}: Description`,
      description: 'Preferred description style used across entity presenters',
      category: `Entities: ${this.definition.category}`,
      options: [],
      value: ''
    });
    this.preferredSetting.onValueChanged((value) => {
      this.describers.find((d) => d.label === value)?.setPreferred();
    });
    try {
      this.prefsStore?.registerPreference(this.preferredSetting);
    } catch {
      // allow lightweight tests that construct definitions without bootstrapping prefs
    }
  }

  register(describer: EntityDescriberComponent<T>) {
    this.describers.push(describer);
    const options = this.describers.map((d) => {
      return {
        key: d.label,
        label: d.label
      };
    });

    describer.registerListener({
      preferred: () => {
        this.preferredSetting.setValue(describer.label);
      }
    });

    this.preferredSetting.setOptions(options);
  }

  getSettings(): AbstractSetting[] {
    return [this.preferredSetting];
  }

  getDescribers(): EntityDescriberComponent<T>[] {
    return this.describers;
  }

  getPreferredDescriber(): EntityDescriberComponent<T> | null {
    const preferredLabel = this.preferredSetting.value;
    if (preferredLabel) {
      const found = this.describers.find((d) => d.label === preferredLabel);
      if (found) {
        return found;
      }
    }
    return this.describers[0] || null;
  }
}
