import { Shortcut, ShortcutChord } from '../../stores/shortcuts/Shortcut';
import { ActionSource } from '../Action';
import { ShortcutHandlerAction } from '../../stores/shortcuts/ShortcutHandler';
import { ioc } from '../../inversify.config';
import { System } from '../../core/System';
import { ActionShortcutHandler } from './ActionShortcutHandler';
import * as _ from 'lodash';

export class ActionShortcut extends Shortcut {
  private disposer: () => any;
  private handler: ActionShortcutHandler;

  constructor(action: ShortcutHandlerAction, handler: ActionShortcutHandler) {
    super(action);
    this.disposer = null;
    this.handler = handler;
  }

  dispose() {
    this.disposer?.();
  }

  getAction() {
    return ioc.get(System).getAction(this.action.id);
  }

  enable(enabled: boolean) {
    super.enable(enabled);
    if (enabled) {
      this.handler.hotkeys.listen();
      this.handler.hotkeys2.listen();
    } else {
      this.handler.hotkeys.unListen();
      this.handler.hotkeys2.unListen();
    }
  }

  fireAction() {
    this.getAction().fireAction({
      source: ActionSource.HOTKEY,
      position: null
    });
  }

  bind() {
    // unbind previous shortcuts if there were some
    this.dispose();

    // bind the new shortcuts
    this.disposer = this.handler.hotkeys.register({
      strokes: this.chord.primary,
      callback: () => {
        _.defer(() => {
          if (this.chord.hasSecondary()) {
            const secondaryDisposer = this.handler.hotkeys2.register({
              strokes: this.chord.secondary,
              callback: () => {
                this.fireAction();
              }
            });

            setTimeout(() => {
              secondaryDisposer();
            }, 400);
          } else {
            this.fireAction();
          }
        });
      }
    });
  }

  setChord(keys: ShortcutChord) {
    super.setChord(keys);
    this.bind();
  }
}
