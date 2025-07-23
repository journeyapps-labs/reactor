import * as React from 'react';
import * as _ from 'lodash';
import { FloatingPanelWidget } from '../../../widgets/floating/FloatingPanelWidget';
import { ComboBoxItem, UIItemsDirective, ComboBoxCheckedItem } from '../../../stores/combo/ComboBoxDirectives';
import { SmartPositionWidget } from '../SmartPositionWidget';
import { RawComboBoxWidget } from '../RawComboBoxWidget';
import { ListItemRenderEvent } from '../../../widgets/list/ControlledListWidget';
import { ComboBoxItemWidget } from '../ComboBoxItemWidget';
import { CheckboxWidget } from '../../../widgets/forms/CheckboxWidget';
import styled from '@emotion/styled';
import { FloatingPanelButtonWidget } from '../../../widgets/floating/FloatingPanelButtonWidget';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import { COMBOBOX_ITEM_H_PADDING } from '../../../layout';

export interface MultiDirectiveComboWidgetProps {
  directive: UIItemsDirective<ComboBoxCheckedItem>;
  resolve: (items: ComboBoxItem[]) => any;
}

export interface MultiDirectiveComboWidgetState {
  checked: { [key: string]: boolean };
  selected: string;
}

namespace S {
  export const Row = styled.div`
    display: flex;
    margin-top: 5px;
  `;

  export const Button = styled(FloatingPanelButtonWidget)`
    &:first-of-type {
      margin-left: 0;
    }
  `;

  export const Padding = styled.div`
    padding-right: 5px;
  `;
}

namespace S {
  export const Title = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 15px;
    font-weight: 500;
    padding-bottom: 5px;
  `;

  export const Title2 = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 12px;
    font-weight: 500;
    padding-top: 5px;
    opacity: 0.5;
  `;
  export const Meta = themed.div`
    padding: ${COMBOBOX_ITEM_H_PADDING}px;
  `;
}

export class MultiDirectiveComboWidget extends React.Component<
  MultiDirectiveComboWidgetProps,
  MultiDirectiveComboWidgetState
> {
  listener: any;

  // not storing in state because it doesnt need to force repaint
  selectedKey: string;

  constructor(props: MultiDirectiveComboWidgetProps) {
    super(props);

    this.state = {
      // setup initial checked value give directive
      checked: _.chain(props.directive.items)
        .keyBy('key')
        .mapValues((v) => v.checked)
        .value(),
      selected: null
    };
  }

  componentWillUnmount(): void {
    if (this.props.directive.buttons) {
      this.props.resolve(null);
    } else {
      this.fireSelection();
    }
    window.removeEventListener('keyup', this.listener);
  }

  componentDidMount(): void {
    this.listener = (event: KeyboardEvent) => {
      if (event.code === 'Space' && this.selectedKey) {
        this.setState({
          checked: {
            ...this.state.checked,
            // toggle the selection when space is pressed
            [this.selectedKey]: !this.state.checked[this.selectedKey]
          }
        });
      }
    };
    window.addEventListener('keydown', this.listener);
  }

  fireSelection() {
    this.props.resolve(
      _.chain(this.state.checked)
        .omitBy((i) => !i)
        .map((item, key) => {
          return _.find(this.props.directive.items, { key: key });
        })
        .value()
    );
  }

  getTitle() {
    if (this.props.directive.title || this.props.directive.title2) {
      return (
        <S.Meta>
          {this.props.directive?.title ? <S.Title>{this.props.directive?.title}</S.Title> : null}
          {this.props.directive?.title2 ? <S.Title2>{this.props.directive?.title2}</S.Title2> : null}
        </S.Meta>
      );
    }
    return null;
  }

  render() {
    return (
      <SmartPositionWidget position={this.props.directive.position}>
        <FloatingPanelWidget center={false}>
          {this.getTitle()}
          <RawComboBoxWidget
            selected={() => {
              this.fireSelection();
            }}
            hovered={(item) => {
              this.selectedKey = item.key;
            }}
            items={_.map(this.props.directive.items, (item) => {
              return {
                key: item.key,
                render: (event: ListItemRenderEvent) => {
                  return (
                    <ComboBoxItemWidget
                      selected={event.selected}
                      item={item}
                      key={item.key}
                      selectedEvent={() => {
                        this.setState({
                          checked: {
                            ...this.state.checked,
                            [item.key]: !this.state.checked[item.key]
                          }
                        });
                      }}
                      forwardRef={event.ref}
                      {...{
                        onMouseOver: () => {
                          event.select();
                        }
                      }}
                    >
                      <S.Padding>
                        <CheckboxWidget
                          checked={!!this.state.checked[item.key]}
                          onChange={(checked) => {
                            this.setState({
                              checked: {
                                ...this.state.checked,
                                [item.key]: checked
                              }
                            });
                          }}
                        />
                      </S.Padding>
                    </ComboBoxItemWidget>
                  );
                }
              };
            })}
          />
          {this.props.directive.buttons ? (
            <S.Row>
              <S.Button
                btn={{
                  label: 'Cancel',
                  action: () => {
                    this.props.resolve(null);
                  }
                }}
              />
              <S.Button
                btn={{
                  label: 'Continue',
                  action: () => {
                    this.fireSelection();
                  }
                }}
              />
            </S.Row>
          ) : null}
        </FloatingPanelWidget>
      </SmartPositionWidget>
    );
  }
}
