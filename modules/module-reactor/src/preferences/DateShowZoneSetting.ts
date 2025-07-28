import { ioc } from '../inversify.config';
import { PrefsStore } from '../stores/PrefsStore';
import { BooleanSetting } from '../settings/BooleanSetting';

export class DateShowZoneSetting extends BooleanSetting {
  static KEY = '/dates/show-zone';

  constructor() {
    super({
      name: 'Display time zone alongside dates',
      key: DateShowZoneSetting.KEY,
      category: 'Date and time',
      checked: false
    });
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<DateShowZoneSetting>(DateShowZoneSetting.KEY);
  }
}
