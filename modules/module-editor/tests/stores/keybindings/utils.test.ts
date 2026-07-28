import { describe, expect, it } from 'vitest';
import { KeyCodeChord } from 'monaco-editor/base/common/keybindings';
import { compareChords } from '../../../src/stores/keybindings/utils';

interface ChordModifiers {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

const chord = (keyCode: number, modifiers: Partial<ChordModifiers> = {}) => {
  return {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    keyCode,
    ...modifiers
  };
};

describe('compareChords', () => {
  it('compares Monaco chord instances structurally', () => {
    const monacoChord = new KeyCodeChord(true, false, true, false, 42);
    const restoredChord = chord(42, { ctrlKey: true, altKey: true });

    expect(compareChords({ chords: [monacoChord] }, { chords: [restoredChord] })).toBe(true);
  });

  it('compares every chord in a sequence in order', () => {
    const binding = { chords: [chord(42, { ctrlKey: true }), chord(43, { shiftKey: true })] };

    expect(compareChords(binding, { chords: [chord(42, { ctrlKey: true }), chord(43, { shiftKey: true })] })).toBe(
      true
    );
    expect(compareChords(binding, { chords: [chord(43, { shiftKey: true }), chord(42, { ctrlKey: true })] })).toBe(
      false
    );
    expect(compareChords(binding, { chords: [chord(42, { ctrlKey: true })] })).toBe(false);
  });

  it.each(['ctrlKey', 'shiftKey', 'altKey', 'metaKey'] as const)('distinguishes the %s modifier', (modifier) => {
    expect(compareChords({ chords: [chord(42)] }, { chords: [chord(42, { [modifier]: true })] })).toBe(false);
  });

  it('returns false for malformed bindings without chords', () => {
    expect(compareChords({} as any, { chords: [chord(42)] })).toBe(false);
  });
});
