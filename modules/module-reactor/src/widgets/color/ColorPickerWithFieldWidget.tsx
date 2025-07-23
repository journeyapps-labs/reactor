import * as React from 'react';
import styled from '@emotion/styled';
import { ColorPickerWidget } from './ColorPickerWidget';
import * as Color from 'color';
import * as _ from 'lodash';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Input } from '../forms/inputs';

export interface ColorPickerWithFieldWidgetProps {
  color: string;
  colorChanged: (color: string) => any;
}

export interface ColorPickerWithFieldWidgetState {
  color: string;
  propColor: string;
}

namespace S {
  export const SmallInput = themed(Input)`
      width: 100px;
      margin-right: 2px;
      font-size: 14px;
      border: solid 1px ${(p: any) => (p.error ? p.theme.status.failed : 'transparent')};
      border-radius: 3px;
  `;

  export const Entry = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    &:last-of-type {
      margin-bottom: 0;
    }
  `;
}

export class ColorPickerWithFieldWidget extends React.Component<
  ColorPickerWithFieldWidgetProps,
  ColorPickerWithFieldWidgetState
> {
  constructor(props: ColorPickerWithFieldWidgetProps) {
    super(props);
    this.state = {
      color: props.color,
      propColor: props.color
    };
  }

  static getDerivedStateFromProps(
    props: ColorPickerWithFieldWidgetProps,
    state: ColorPickerWithFieldWidgetState
  ): ColorPickerWithFieldWidgetState {
    if (props.color !== state.propColor) {
      return {
        propColor: props.color,
        color: props.color
      };
    }
    return null;
  }

  isValid() {
    try {
      new Color(this.state.color);
      return true;
    } catch (ex) {
      return false;
    }
  }

  colorChanged = _.debounce((color: string) => {
    this.props.colorChanged(color);
  }, 60);

  render() {
    return (
      <S.Entry>
        <S.SmallInput
          {...{
            error: !this.isValid()
          }}
          onChange={(event) => {
            try {
              new Color(event.target.value);
              this.setState(
                {
                  color: event.target.value
                },
                () => {
                  this.props.colorChanged(this.state.color);
                }
              );
            } catch (ex) {
              this.setState({
                color: event.target.value
              });
            }
          }}
          value={this.state.color || ''}
        />
        <ColorPickerWidget
          colorChanged={(color) => {
            this.setState({
              color: color
            });
            _.defer(() => {
              this.colorChanged(color);
            });
          }}
          color={this.state.color}
        />
      </S.Entry>
    );
  }
}
