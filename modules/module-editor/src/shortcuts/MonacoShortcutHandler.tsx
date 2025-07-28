import {
  ioc,
  keyType,
  ShortcutChord,
  ShortcutHandler,
  ShortcutHandlerAction,
  ShortcutHandlerSerialized,
  ShortcutKey,
  System
} from '@journeyapps-labs/reactor-mod';
import { MonacoShortcut } from './MonacoShortcut';
import { MonacoMapInverted } from './MonacoShortcutMap';
import { MonacoKeybindingStore } from '../stores/keybindings/MonacoKeybindingStore';
import { Keybinding } from '../stores/keybindings/definitions';
import { action } from 'mobx';

export interface MonacoShortcutHandlerOptions {
  keybindingStore: MonacoKeybindingStore;
}

export class MonacoShortcutHandler extends ShortcutHandler<MonacoShortcut> {
  constructor(protected options2: MonacoShortcutHandlerOptions) {
    super({
      key: 'monaco-shortcuts',
      type: `${ioc.get(System).ideName} Editor`,
      serializeID: 'v2.0.0'
    });
  }

  get store() {
    return this.options2.keybindingStore;
  }

  @action async deserialize(data: ShortcutHandlerSerialized) {
    await this.store.waitForReady();
    await super.deserialize(data);

    // unbind defaults which have been user-removed (this code is only necessary on initial deserialization)
    this.getPossibleActions().forEach((action) => {
      const existing = this.getShortcutsForAction(action);
      action.defaultKeybindings.forEach((k) => {
        if (!existing.find((shortcut) => shortcut.chord.uuid === k.uuid)) {
          const s = this.generateShortcut(action);
          s.setChord(k, false);
          s.dispose();
        }
      });
    });
  }

  getMetaForAction(id: string): ShortcutHandlerAction<MonacoShortcutHandler> {
    const action = this.store.getActionFromID(id);
    if (!action) {
      this.logger.info(`could not find action ${id}`);
      return null;
    }
    return {
      handler: this,
      label: action.label,
      id: id,
      supportsMultipleShortcuts: action.bindings.length < 2,
      defaultKeybindings: action.bindings.map(
        (binding) => new ShortcutChord(this.getShortcutKeys(binding, true), this.getShortcutKeys(binding, false))
      )
    };
  }

  getPossibleActions(): ShortcutHandlerAction<MonacoShortcutHandler>[] {
    // some actions should not be shown to the user
    const HIDDEN = [`Command palette`];
    return this.store.actions
      .filter((action) => HIDDEN.indexOf(action.label) === -1)
      .map((action) => {
        return this.getMetaForAction(action.id);
      });
  }

  getShortcutKeys(item: Keybinding, primary: boolean): ShortcutKey[] {
    const items: ShortcutKey[] = [];
    const entry = item.chords[primary ? 0 : 1];
    if (!entry) {
      return [];
    }
    if (entry.altKey) {
      items.push({
        key: '',
        type: keyType.ALT
      });
    }
    if (entry.ctrlKey) {
      items.push({
        key: '',
        type: keyType.CTRL
      });
    }
    if (entry.metaKey) {
      items.push({
        key: '',
        type: keyType.META
      });
    }
    if (entry.shiftKey) {
      items.push({
        key: '',
        type: keyType.SHIFT
      });
    }

    if (entry.keyCode) {
      const code = MonacoMapInverted[`${entry.keyCode}`];
      if (!code) {
        console.log('unknown code', entry.keyCode);
      } else {
        items.push({
          key: code,
          type: keyType.STANDARD
        });
      }
    }

    return items;
  }

  generateShortcut(data: ShortcutHandlerAction<MonacoShortcutHandler>): MonacoShortcut {
    return new MonacoShortcut(data);
  }
}
