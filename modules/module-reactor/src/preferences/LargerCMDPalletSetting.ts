import { ioc } from '../inversify.config';
import { PrefsStore } from '../stores/PrefsStore';
import { BooleanSetting } from '../settings/BooleanSetting';

export class LargerCMDPalletSetting extends BooleanSetting {
  static KEY = '/advanced/larger-cmd-pallet';

  constructor() {
    super({
      name: 'Show a larger command palette (for larger screens)',
      key: LargerCMDPalletSetting.KEY,
      category: 'Advanced',
      checked: false
    });
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<LargerCMDPalletSetting>(LargerCMDPalletSetting.KEY);
  }
}
