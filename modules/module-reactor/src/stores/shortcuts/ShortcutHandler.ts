import { Shortcut, ShortcutChord, ShortcutSerialized } from './Shortcut';
import { action, observable } from 'mobx';
import { AbstractSetting, AbstractSettingOptions } from '../../settings/AbstractSetting';
import * as _ from 'lodash';

export interface ShortcutHandlerOptions extends AbstractSettingOptions {
  type: string;
}

export interface ShortcutHandlerAction<T extends ShortcutHandler = ShortcutHandler> {
  handler: T;
  label: string;
  id: string;
  supportsMultipleShortcuts: boolean;
  defaultKeybindings: ShortcutChord[];
}

export interface ShortcutHandlerSerialized {
  shortcuts?: ShortcutSerialized[];
  shortcutsV2: {
    [action_id: string]: ShortcutSerialized[];
  };
}

export abstract class ShortcutHandler<
  T extends Shortcut = Shortcut,
  O extends ShortcutHandlerOptions = ShortcutHandlerOptions
> extends AbstractSetting<O> {
  @observable
  private accessor shortcuts: T[];

  constructor(options: O) {
    super(options);
    this.shortcuts = [];
  }

  abstract getMetaForAction(id: string): ShortcutHandlerAction;

  abstract generateShortcut(action: ShortcutHandlerAction): T;

  abstract getPossibleActions(): ShortcutHandlerAction[];

  getShortcutsForAction(action: ShortcutHandlerAction): T[] {
    if (!action) {
      return [];
    }
    return this.getShortcuts().filter((p) => p.action.id === action.id);
  }

  getShortcuts() {
    return this.shortcuts;
  }

  async reset() {
    this.logger.debug(`resetting shortcuts to defaults`);
    this.dispose();
    this.getPossibleActions().forEach((s) => {
      s.defaultKeybindings.forEach((d) => {
        let shortcut = this.generateShortcut(s);
        shortcut.setChord(d, false);
        this.addShortcut(shortcut);
      });
    });
  }

  dispose() {
    this.shortcuts.forEach((shortcut) => {
      shortcut.dispose();
    });
    this.shortcuts = [];
  }

  addShortcut(shortcut: T) {
    shortcut.registerListener({
      deleted: () => {
        this.shortcuts.splice(this.shortcuts.indexOf(shortcut), 1);
        this.save();
      },
      changed: () => {
        this.save();
      }
    });
    this.shortcuts.push(shortcut);
  }

  v2Patch(data: ShortcutHandlerSerialized) {
    if (!data.shortcutsV2) {
      this.logger.warn(`Running shortcut migration`);
      let actions = _.chain(data.shortcuts)
        .groupBy((s) => {
          return s.action;
        })
        .pickBy((p, action_id) => {
          const actionMeta = this.getMetaForAction(action_id);
          if (!actionMeta) {
            this.logger.warn(`Shortcut migration: ${action_id} no longer exists, ignoring.`);
            return;
          }

          const existing_uuids = p.map((s) => new ShortcutChord(s.primary, s.secondary).uuid);
          const new_uuids = actionMeta.defaultKeybindings.map((a) => a.uuid);

          return _.intersection(existing_uuids, new_uuids).length !== new_uuids.length;
        })
        .value();
      return {
        shortcutsV2: actions
      };
    }
    return data;
  }

  @action async deserialize(data: ShortcutHandlerSerialized) {
    this.dispose();
    data = this.v2Patch(data);
    this.logger.debug(`deserializing [${_.keys(data.shortcutsV2).length}] shortcuts`);

    this.getPossibleActions().forEach((s) => {
      if (data.shortcutsV2[s.id]) {
        data.shortcutsV2[s.id].forEach((d) => {
          let shortcut = this.generateShortcut(s);
          shortcut.deserialize(d);
          this.addShortcut(shortcut);
        });
      } else {
        s.defaultKeybindings.forEach((d) => {
          let shortcut = this.generateShortcut(s);
          shortcut.setChord(d, false);
          this.addShortcut(shortcut);
        });
      }
    });
  }

  serialize(): ShortcutHandlerSerialized {
    return {
      shortcuts: this.shortcuts.map((shortcut) => {
        return shortcut.serialize();
      }),
      shortcutsV2: this.getPossibleActions().reduce((prev, action) => {
        const action_shortcuts = this.shortcuts.filter((s) => s.action.id === action.id);
        const existing_ids = action_shortcuts.map((s) => s.chord.uuid);
        const default_ids = action.defaultKeybindings.map((s) => s.uuid);
        if (!_.isEqual(default_ids, existing_ids)) {
          prev[action.id] = action_shortcuts.map((s) => s.serialize());
        }
        return prev;
      }, {})
    };
  }
}
