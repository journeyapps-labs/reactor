// Monaco 33 -> 34
// SimpleKeybinding -> KeyCodeChord
// ChordKeybinding.parts -> Keybinding.chords

export interface ContextKey {
  key: string;
  negated: null;
  type: number;
}

export interface MonacoStoreAction {
  id: string;
  label: string;
  bindings: Keybinding[];
}

export interface KeyCodeChord {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  keyCode: number;
  equals: (item: KeyCodeChord) => boolean;
}

export interface Keybinding {
  chords: KeyCodeChord[];
}
