import * as React from 'react';
import styled from '@emotion/styled';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import * as Color from 'color';
import { SmartPositionWidget } from '../../layers/combo/SmartPositionWidget';
import { FloatingPanelWidget } from '../floating/FloatingPanelWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface ColorPickerWidgetProps {
  color: string;
  colorChanged: (color: string) => any;
}

export interface ColorPickerWidgetState {
  show: boolean;
}

namespace S {
  export const Container = themed.div<{ selected: boolean }>`
    outline: none;
    border: solid 1px ${(p) => (p.selected ? p.theme.header.primary : 'transparent')};
    color: ${(p) => p.theme.text.secondary};
    background: ${(p) => p.theme.panels.trayBackground};
    padding: 3px;
    padding-right: 5px;
    box-sizing: border-box;
    font-size: 15px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    border-radius: 4px;

    &:hover{
      color: ${(p) => p.theme.text.primary};
    }
  `;

  export const Square = styled.div<{ color: string }>`
    border-radius: 2px;
    width: 20px;
    height: 20px;
    background: ${(p) => p.color};
    margin-right: 5px;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  export const Icon = styled(FontAwesomeIcon)`
    font-size: 13px;
  `;

  export const Floating = themed(SmartPositionWidget)`
    position: fixed;
    z-index: 2;

    .sketch-picker {
      background: transparent !important;
      width: 240px !important;

      input {
        background: transparent !important;
        color: white !important;
        border: solid 1px transparent !important;
        box-shadow: none !important;
        background: ${(p) => p.theme.panels.trayBackground} !important;
        border-radius: 3px !important;
      }

      span{
        color: white !important;
      }
    }
  `;
}

export class ColorPickerWidget extends React.Component<ColorPickerWidgetProps, ColorPickerWidgetState> {
  ref: React.RefObject<HTMLDivElement>;
  listener: any;
  id: string;

  constructor(props: ColorPickerWidgetProps) {
    super(props);
    this.state = {
      show: false
    };
    this.id = v4();
    this.ref = React.createRef();
  }

  componentWillUnmount(): void {
    this.dispose();
  }

  dispose = () => {
    if (this.listener) {
      window.removeEventListener('mousedown', this.listener);
      this.listener = null;
    }
  };

  mouseDown = () => {
    if (this.state.show) {
      this.setState(
        {
          show: false
        },
        this.dispose
      );
      return;
    }
    this.setState(
      {
        show: true
      },
      () => {
        this.listener = (event: MouseEvent) => {
          _.defer(() => {
            this.setState(
              {
                show: false
              },
              this.dispose
            );
          });
        };

        window.addEventListener('mousedown', this.listener);
      }
    );
  };

  getFloatingPanel() {
    if (this.state.show) {
      const pos = this.ref.current.getBoundingClientRect();
      return (
        <S.Floating
          position={{
            clientX: pos.x,
            clientY: pos.y
          }}
        >
          <FloatingPanelWidget center={false}>
            <SketchPicker
              color={this.props.color}
              onChange={(color) => {
                this.props.colorChanged(color.hex);
              }}
            />
          </FloatingPanelWidget>
        </S.Floating>
      );
    }
    return null;
  }

  isValid() {
    try {
      new Color(this.props.color);
      return true;
    } catch (ex) {
      return false;
    }
  }

  render() {
    return (
      <>
        <S.Container id={this.id} selected={this.state.show} ref={this.ref} onClick={this.mouseDown}>
          <S.Square color={this.props.color}>{this.isValid() ? null : <FontAwesomeIcon icon="times" />}</S.Square>
          <S.Icon icon="angle-down" />
        </S.Container>
        {this.getFloatingPanel()}
      </>
    );
  }
}
