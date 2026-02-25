import { SetControlOption } from '../../../controls/SetControl';
import { inject } from '../../../inversify.config';
import { AbstractSetting } from '../../../settings/AbstractSetting';
import { SetSetting, SetSettingOptions } from '../../../settings/SetSetting';
import { PrefsStore } from '../../../stores/PrefsStore';
import { ComponentBank } from './ComponentBank';

export interface PreferredSetBankSettingOptions extends Omit<SetSettingOptions, 'options' | 'value'> {}

export interface PreferredSetBankOptions<T> {
  setting: PreferredSetBankSettingOptions;
  getOption: (item: T) => SetControlOption<string>;
}

export class PreferredSetBank<T> extends ComponentBank<T> {
  @inject(PrefsStore)
  accessor prefsStore: PrefsStore;

  protected preferredSetting: SetSetting;

  constructor(protected options: PreferredSetBankOptions<T>) {
    super();
    this.preferredSetting = new SetSetting({
      ...options.setting,
      options: [],
      value: ''
    });
    this.preferredSetting.registerListener({
      updated: () => {
        const preferred = this.find((item) => this.options.getOption(item).key === this.preferredSetting.value);
        if (preferred) {
          this.onPreferredChanged(preferred);
        }
      }
    });
    try {
      this.prefsStore?.registerPreference(this.preferredSetting);
    } catch {
      // allow lightweight tests that construct definitions without bootstrapping prefs
    }
  }

  register(item: T): T {
    super.register(item);
    this.syncOptions();
    return item;
  }

  getSettings(): AbstractSetting[] {
    return [this.preferredSetting];
  }

  getPreferred(): T | null {
    const preferred = this.find((item) => this.options.getOption(item).key === this.preferredSetting.value);
    if (preferred) {
      return preferred;
    }
    return this.getFirst();
  }

  setPreferred(item: T | string) {
    const key = typeof item === 'string' ? item : this.options.getOption(item).key;
    this.preferredSetting.setValue(key);
  }

  protected onPreferredChanged(item: T) {}

  protected syncOptions() {
    this.preferredSetting.setOptions(this.getItems().map((item) => this.options.getOption(item)));
  }
}
