import { ioc } from '../inversify.config';
import { PrefsStore } from '../stores/PrefsStore';
import { BooleanSetting } from '../settings/BooleanSetting';

export class DateLocalSetting extends BooleanSetting {
  static KEY = '/dates/local-time';

  constructor() {
    super({
      name: 'Display dates in local time',
      key: DateLocalSetting.KEY,
      category: 'Date and time',
      checked: true
    });
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<DateLocalSetting>(DateLocalSetting.KEY);
  }
}
