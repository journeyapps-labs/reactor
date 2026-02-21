import { System } from '../../core/System';
import { inject, ioc } from '../../inversify.config';
import * as _ from 'lodash';
import { ActionShortcut } from './ActionShortcut';
import { Action } from '../Action';
import { ShortcutHandler, ShortcutHandlerAction } from '../../stores/shortcuts/ShortcutHandler';
import { ShortcutKey } from '../../stores/shortcuts/Shortcut';
import { Hotkeys } from './Hotkeys';
import { ACTION_SHORTCUT_HANDLER } from './action-shortcut-common';
import { ActionStore } from '../../stores/actions/ActionStore';

export class ActionShortcutHandler extends ShortcutHandler<ActionShortcut> {
  @inject(System)
  accessor system: System;

  @inject(ActionStore)
  accessor actionStore: ActionStore;

  stack: ShortcutKey[][];
  hotkeys: Hotkeys;
  hotkeys2: Hotkeys;

  constructor() {
    super({
      key: ACTION_SHORTCUT_HANDLER,
      type: `${ioc.get(System).ideName} Action`,
      serializeID: 'v1.0.0'
    });
    this.stack = [];
    this.hotkeys = new Hotkeys();
    this.hotkeys2 = new Hotkeys();
  }

  async init() {
    await super.init();
    this.hotkeys.listen();
    this.hotkeys2.listen();
  }

  generateShortcut(action: ShortcutHandlerAction): ActionShortcut {
    return new ActionShortcut(action, this);
  }

  generateActionShortcut(action: Action): ShortcutHandlerAction {
    return {
      handler: this,
      id: action.options.name,
      label: action.options.name,
      supportsMultipleShortcuts: true,
      defaultKeybindings: action.options.hotkeys
    };
  }

  getShortcutsForReactorAction(action: Action): ActionShortcut[] {
    return this.getShortcutsForAction(this.generateActionShortcut(action));
  }

  getPossibleActions(): ShortcutHandlerAction[] {
    return this.actionStore.getActions().map((action) => {
      return this.generateActionShortcut(action);
    });
  }

  getMetaForAction(id: string): ShortcutHandlerAction {
    return this.generateActionShortcut(this.actionStore.getAction(id));
  }
}
