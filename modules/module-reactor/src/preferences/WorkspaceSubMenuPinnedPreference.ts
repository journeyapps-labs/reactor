import { BooleanSetting } from '../settings/BooleanSetting';
import { PrefsStore } from '../stores/PrefsStore';
import { ioc } from '../inversify.config';

export class WorkspaceSubMenuPinnedPreference extends BooleanSetting {
  static KEY = '/workspace/sub-menu-pinned';

  constructor() {
    super({
      key: WorkspaceSubMenuPinnedPreference.KEY,
      checked: true,
      name: 'Pin workspace submenu',
      description: 'Keeps nested workspace tabs visible below the header.',
      category: 'Workspace'
    });
  }

  static pinned(): boolean {
    return WorkspaceSubMenuPinnedPreference.get().checked;
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<WorkspaceSubMenuPinnedPreference>(WorkspaceSubMenuPinnedPreference.KEY);
  }
}
