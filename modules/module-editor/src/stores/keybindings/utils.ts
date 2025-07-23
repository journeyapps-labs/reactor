import { Keybinding } from './definitions';

export const compareChords = (a: Keybinding, b: Keybinding) => {
  if (!a.chords || !b.chords) {
    return;
  }
  if (a.chords.length !== b.chords.length) {
    return;
  }

  return !a.chords.some((aPart, index) => {
    return !aPart.equals(b.chords[index]);
  });
};
