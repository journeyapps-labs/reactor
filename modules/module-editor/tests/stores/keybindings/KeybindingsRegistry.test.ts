import { describe, expect, it, vi } from 'vitest';
import { KeyCodeChord } from 'monaco-editor/base/common/keybindings';
import {
  CustomCommandBindings,
  ExistingCommandBindings,
  ResolvedKeybindingItem
} from '../../../src/stores/keybindings/KeybindingsRegistry';

const chord = (keyCode: number) => ({
  ctrlKey: true,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  keyCode
});

describe('CommandBindings', () => {
  it('reuses the complete Monaco default when a restored binding matches it', () => {
    const defaultBinding = {
      chords: [new KeyCodeChord(true, false, false, false, 42)]
    };
    const defaultItem: ResolvedKeybindingItem = {
      command: 'editor.action.test',
      keybinding: defaultBinding,
      when: {
        key: 'editorTextFocus',
        negated: null,
        type: 0
      }
    };
    const bindings = new ExistingCommandBindings(defaultItem.command, [defaultItem]);

    bindings.addKeybinding({ chords: [chord(42)] });

    expect(bindings.serialize()).toEqual([defaultItem]);
    expect(bindings.serialize()[0]).toBe(defaultItem);
  });

  it('does not remove another binding or emit an update when deletion finds no match', () => {
    const bindings = new CustomCommandBindings('editor.action.test');
    const updated = vi.fn();
    bindings.registerListener({ updated });
    bindings.addKeybinding({ chords: [chord(42)] });
    updated.mockClear();

    bindings.deleteKeybinding({ chords: [chord(43)] });

    expect(bindings.serialize().map((item) => item.keybinding)).toEqual([{ chords: [chord(42)] }]);
    expect(updated).not.toHaveBeenCalled();
  });

  it('deletes a binding using an equivalent restored chord', () => {
    const bindings = new CustomCommandBindings('editor.action.test');
    const updated = vi.fn();
    bindings.registerListener({ updated });
    bindings.addKeybinding({
      chords: [new KeyCodeChord(true, false, false, false, 42)]
    });
    updated.mockClear();

    bindings.deleteKeybinding({ chords: [chord(42)] });

    expect(bindings.serialize()).toEqual([]);
    expect(updated).toHaveBeenCalledOnce();
  });
});
