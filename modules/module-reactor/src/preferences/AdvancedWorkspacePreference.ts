import { BooleanSetting } from '../settings/BooleanSetting';
import { PrefsStore } from '../stores/PrefsStore';
import { ioc } from '../inversify.config';
import { WorkspaceStore } from '../stores/workspace/WorkspaceStore';

export class AdvancedWorkspacePreference extends BooleanSetting {
  static KEY = '/workspace/advanced-mode';

  constructor() {
    super({
      key: AdvancedWorkspacePreference.KEY,
      checked: true,
      name: 'Advanced workspace management',
      description: `Enables tabs, drag & drop layouts and the ability to setup and manage custom workspaces`,
      category: 'Workspace',
      changed: (advancedMode) => {
        this.recompute();
      }
    });

    // only happens when interacted by a user
    this.registerListener({
      updated: () => {
        const workspaceStore = ioc.get(WorkspaceStore);
        workspaceStore.reset();
      }
    });
  }

  recompute() {
    const workspaceStore = ioc.get(WorkspaceStore);
    workspaceStore.switchLayoutEngine(this.checked);
    workspaceStore.engine.setLocked(!this.checked);
  }

  deserialize(data) {
    super.deserialize(data);
    this.recompute();
  }

  reset() {
    super.reset();
    this.recompute();
  }

  static enabled(): boolean {
    return AdvancedWorkspacePreference.get().checked;
  }

  static get() {
    return ioc.get(PrefsStore).getPreference<AdvancedWorkspacePreference>(AdvancedWorkspacePreference.KEY);
  }
}
