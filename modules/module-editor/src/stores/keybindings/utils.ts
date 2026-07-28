import { Keybinding } from './definitions';
import * as _ from 'lodash';

const comparableChords = (keybinding: Keybinding) => {
  return keybinding.chords.map(({ ctrlKey, shiftKey, altKey, metaKey, keyCode }) => ({
    ctrlKey,
    shiftKey,
    altKey,
    metaKey,
    keyCode
  }));
};

export const compareChords = (a: Keybinding, b: Keybinding): boolean => {
  if (!a.chords || !b.chords) {
    return false;
  }
  return _.isEqual(comparableChords(a), comparableChords(b));
};
