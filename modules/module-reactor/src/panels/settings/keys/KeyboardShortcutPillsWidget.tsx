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
    border-radius: 8px;
    overflow: hidden;
    user-select: none;
  `;

  export const Stroke = styled.div`
    margin-right: 2px;
    display: flex;
    align-items: center;

    &:last-of-type {
      margin-right: 0;
    }
  `;
}

export class KeyboardShortcutPillsWidget extends React.Component<KeyboardShortcutPillsWidgetProps> {
  getPill(key: ShortcutKey) {
    if (key.type === keyType.META) {
      return <TablePillWidget key={key.type}>⌘</TablePillWidget>;
    }
    if (key.type === keyType.SHIFT) {
      return <TablePillWidget key={key.type}>⇧</TablePillWidget>;
    }
    if (key.type === keyType.CTRL) {
      return <TablePillWidget key={key.type}>ctrl</TablePillWidget>;
    }
    if (key.type === keyType.ALT) {
      return <TablePillWidget key={key.type}>{windows ? 'alt' : '⌥'}</TablePillWidget>;
    }
    if (key.type === keyType.STANDARD && key.key === ' ') {
      return (
        <TablePillWidget special={true} key={key.type}>
          Space
        </TablePillWidget>
      );
    }
    return (
      <TablePillWidget special={true} key={key.key}>
        {key.key}
      </TablePillWidget>
    );
  }

  getKeyboardStroke(keys: ShortcutKey[]) {
    if (keys.length === 0) {
      return null;
    }
    return (
      <S.Stroke>
        {_.sortBy(keys, 'type').map((hotkey) => {
          return this.getPill(hotkey);
        })}
      </S.Stroke>
    );
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        {this.getKeyboardStroke(this.props.chord.primary)}
        {this.getKeyboardStroke(this.props.chord.secondary)}
      </S.Container>
    );
  }
}
