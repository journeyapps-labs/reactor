import * as React from 'react';
import { keyType, ShortcutKey, ShortcutChord } from '../../../stores/shortcuts/Shortcut';
import { TablePillWidget } from '../../../widgets/table/TablePillWidget';
import styled from '@emotion/styled';
import * as _ from 'lodash';
import { windows } from 'platform-detect/os.mjs';

export interface KeyboardShortcutPillsWidgetProps {
  chord: ShortcutChord;
  className?: any;
}

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;
  `;

  export const Stroke = styled.div`
    display: flex;
    align-items: center;
  `;
}

export class KeyboardShortcutPillsWidget extends React.Component<KeyboardShortcutPillsWidgetProps> {
  getKeyLabel(key: ShortcutKey) {
    if (key.type === keyType.META) {
      return '⌘';
    }
    if (key.type === keyType.SHIFT) {
      return '⇧';
    }
    if (key.type === keyType.CTRL) {
      return 'ctrl';
    }
    if (key.type === keyType.ALT) {
      return windows ? 'alt' : '⌥';
    }
    if (key.type === keyType.STANDARD && key.key === ' ') {
      return 'Space';
    }
    return key.key?.toUpperCase() || '';
  }

  getKeyboardStroke(keys: ShortcutKey[], index: number) {
    if (keys.length === 0) {
      return null;
    }
    const sortedKeys = _.sortBy(keys, 'type');
    const standardKey = sortedKeys.find((hotkey) => hotkey.type === keyType.STANDARD);
    const modifiers = sortedKeys
      .filter((hotkey) => hotkey.type !== keyType.STANDARD)
      .map((hotkey) => this.getKeyLabel(hotkey));
    const label = modifiers.join(' ');
    const value = standardKey ? this.getKeyLabel(standardKey) : '';

    return (
      <S.Stroke key={`stroke-${index}`}>
        <TablePillWidget value={label ? value : undefined}>{label || value}</TablePillWidget>
      </S.Stroke>
    );
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        {this.props.chord.getAsArray().map((keys, index) => this.getKeyboardStroke(keys, index))}
      </S.Container>
    );
  }
}
