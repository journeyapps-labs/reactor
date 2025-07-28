import * as React from 'react';
import styled from '@emotion/styled';
import { DialogWidget } from '../dialog/DialogWidget';
import { keyType, ShortcutChord, ShortcutKey } from '../../stores/shortcuts/Shortcut';
import * as _ from 'lodash';
import { KeyboardShortcutPillsWidget } from '../../panels/settings/keys/KeyboardShortcutPillsWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { FloatingPanelButtonWidget } from '../../widgets/floating/FloatingPanelButtonWidget';

export interface KeyCommandDialogWidgetProps {
  save: (keys: ShortcutChord) => any;
}

export interface KeyCommandDialogWidgetState {
  keysPrimary: ShortcutKey[];
  keysSecondary: ShortcutKey[];
  listenPrimary: boolean;
}

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
  `;
  export const Listening = themed.div`
      font-size: 12px;
      opacity: 0.4;
      margin-left: 5px;
      color: ${(p) => p.theme.text.primary};
  `;
}

export class KeyCommandDialogWidget extends React.Component<KeyCommandDialogWidgetProps, KeyCommandDialogWidgetState> {
  listener: any;

  constructor(props: KeyCommandDialogWidgetProps) {
    super(props);
    this.state = {
      keysPrimary: [],
      keysSecondary: [],
      listenPrimary: true
    };
  }

  generateKey(key: string): ShortcutKey {
    if (key === 'dead' || key === 'capslock') {
      return null;
    }
    if (key === 'meta') {
      return {
        type: keyType.META
      };
    }
    if (key === 'control') {
      return {
        type: keyType.CTRL
      };
    }
    if (key === 'alt') {
      return {
        type: keyType.ALT
      };
    }
    if (key === 'shift') {
      return {
        type: keyType.SHIFT
      };
    }
    return {
      type: keyType.STANDARD,
      key: key
    };
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.listener);
  }

  componentDidMount(): void {
    this.listener = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const key = this.generateKey(event.key.toLowerCase());
      if (!key) {
        return;
      }
      const selector = this.state.listenPrimary ? 'keysPrimary' : 'keysSecondary';
      const keys = this.state[selector] as ShortcutKey[];
      const found = _.find(keys, key);
      if (!found) {
        this.setState({
          [this.state.listenPrimary ? 'keysPrimary' : 'keysSecondary']: [...keys, key]
        } as any);
      }
    };
    window.addEventListener('keydown', this.listener);
  }

  render() {
    return (
      <DialogWidget
        btns={[
          {
            label: 'Cancel',
            action: () => {
              this.props.save(null);
            }
          },
          {
            label: 'Reset',
            action: () => {
              this.setState({
                keysSecondary: [],
                keysPrimary: [],
                listenPrimary: true
              });
            }
          },
          {
            label: 'Save',
            action: () => {
              this.props.save(new ShortcutChord(this.state.keysPrimary, this.state.keysSecondary));
            }
          }
        ]}
        title="Add shortcut"
        desc="Press the keys you wish to use for this action:"
      >
        <S.Container>
          <KeyboardShortcutPillsWidget chord={new ShortcutChord(this.state.keysPrimary, this.state.keysSecondary)} />
          <S.Listening>Enter key combination...</S.Listening>
          {this.state.listenPrimary && this.state.keysPrimary.length > 0 ? (
            <FloatingPanelButtonWidget
              btn={{
                label: 'Add second keystroke',
                action: () => {
                  this.setState({
                    listenPrimary: false
                  });
                }
              }}
            />
          ) : null}
        </S.Container>
      </DialogWidget>
    );
  }
}
