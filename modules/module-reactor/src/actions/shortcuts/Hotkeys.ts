import { keyType, ShortcutKey } from '../../stores/shortcuts/Shortcut';
import * as _ from 'lodash';
import * as uuid from 'uuid';

export interface HotkeyAction {
  callback: () => any;
  strokes: ShortcutKey[];
}

export interface KeyDownEvent {
  key: ShortcutKey;
  code: string;
}

export class Hotkeys {
  keysDown: KeyDownEvent[];
  stack: KeyDownEvent[];
  actions: { [id: string]: HotkeyAction };
  listening: boolean;

  constructor() {
    this.keysDown = [];
    this.stack = [];
    this.actions = {};
    this.listening = false;
  }

  register(action: HotkeyAction): () => any {
    const id = uuid.v4();
    this.actions[id] = {
      ...action,
      strokes: _.sortBy(action.strokes, ['type', 'key'])
    };
    return () => {
      delete this.actions[id];
    };
  }

  normalizeKey(key: string): ShortcutKey {
    if (key === 'Option' || key === 'Alt') {
      return {
        type: keyType.ALT
      };
    } else if (key === 'Control') {
      return {
        type: keyType.CTRL
      };
    } else if (key === 'Shift') {
      return {
        type: keyType.SHIFT
      };
    } else if (key === 'Meta') {
      return {
        type: keyType.META
      };
    } else {
      return {
        type: keyType.STANDARD,
        key: key.toLowerCase()
      };
    }
  }

  normalizeEvent(event: KeyboardEvent, cb: (key: KeyDownEvent) => any) {
    /**
     * 1. CapsLock only fires when its deactivated
     * 2. Dead keys are dead to us
     * 3. 'undefined keys - what does this even mean?
     */
    if (event.key === 'Dead' || event.key === 'CapsLock' || event.key == null) {
      return;
    }
    cb({
      key: this.normalizeKey(event.key),
      code: event.code
    });
  }

  checkChordActions(key: KeyDownEvent) {
    let found = false;
    const keysSorted = _.sortBy(
      this.keysDown.map((k) => k.key),
      ['type', 'key']
    );
    for (let action of _.values<HotkeyAction>(this.actions)) {
      if (action.strokes.length === 1) {
        continue;
      }
      if (_.isEqual(action.strokes, keysSorted)) {
        found = true;
        action.callback();
      }
    }
    if (found) {
      this.removePressedKey(key);
    }
    return found;
  }

  removePressedKey(key: KeyDownEvent) {
    const index = this.hasKey(key);
    if (index === -1) {
      return;
    }
    this.keysDown.splice(this.hasKey(key), 1);
    if (this.keysDown.length === 0) {
      if (this.stack.length === 1) {
        this.checkSingleKeyActions();
      }
      this.stack = [];
    }
  }

  checkSingleKeyActions() {
    const keysSorted = _.sortBy(
      this.stack.map((k) => k.key),
      ['type', 'key']
    );
    for (let action of _.values<HotkeyAction>(this.actions)) {
      if (action.strokes.length === 1 && _.isEqual(action.strokes, keysSorted)) {
        action.callback();
      }
    }
  }

  hasKey(key: KeyDownEvent, stack = false): number {
    return _.findIndex(stack ? this.stack : this.keysDown, { code: key.code });
  }

  keyDownEvent = (event: KeyboardEvent) => {
    this.normalizeEvent(event, (key) => {
      if (this.hasKey(key, true) === -1) {
        this.stack.push(key);
      }
      if (this.hasKey(key) === -1) {
        this.keysDown.push(key);

        if (this.checkChordActions(key)) {
          event.preventDefault();
        }
      }
    });
  };

  keyUpEvent = (event: KeyboardEvent) => {
    this.normalizeEvent(event, (key) => {
      this.removePressedKey(key);
      // also remove all non standard keys
      // https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key
      if (event.key === 'Meta') {
        this.keysDown.filter((p) => p.key.type === keyType.STANDARD).forEach((key) => this.removePressedKey(key));
      }
    });
  };

  focus = () => {
    this.stack = [];
    this.keysDown = [];
  };

  listen() {
    if (this.listening) {
      return;
    }
    window.addEventListener('keydown', this.keyDownEvent, {
      capture: true
    });
    window.addEventListener('keyup', this.keyUpEvent, {
      capture: true,
      passive: true
    });
    window.addEventListener('mousedown', this.focus);
    // https://www.w3.org/TR/page-visibility/ - this is now in the spec
    document.addEventListener('visibilitychange', this.focus);
    document.addEventListener('focusin', this.focus);
    this.listening = true;
  }

  unListen() {
    if (!this.listening) {
      return;
    }
    window.removeEventListener('keydown', this.keyDownEvent, {
      capture: true
    });
    window.removeEventListener('keyup', this.keyUpEvent, {
      capture: true
    });
    window.removeEventListener('mousedown', this.focus);
    document.removeEventListener('visibilitychange', this.focus);
    document.removeEventListener('focusin', this.focus);
    this.listening = false;
  }
}
