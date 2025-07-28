import { BooleanSetting } from '../settings/BooleanSetting';
import { ioc } from '../inversify.config';
import { PrefsStore } from '../stores/PrefsStore';

export class ShowChangelogSetting extends BooleanSetting {
  static KEY = '/user/show-changelog';

  constructor() {
    super({
      name: 'Show changelog on boot',
      key: ShowChangelogSetting.KEY,
      category: 'User',
      checked: true,
      description:
        'Will show the splashscreen when the IDE has been updated along with a list of changes relative to when you last reloaded.'
    });
  }

  static enabled() {
    return ShowChangelogSetting.get().checked;
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<ShowChangelogSetting>(ShowChangelogSetting.KEY);
  }
}
