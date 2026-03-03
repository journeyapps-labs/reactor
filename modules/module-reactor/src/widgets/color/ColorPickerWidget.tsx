import * as React from 'react';
import styled from '@emotion/styled';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 } from 'uuid';
import Color from 'color';
import { SmartPositionWidget } from '../../layers/combo/SmartPositionWidget';
import { FloatingPanelWidget } from '../floating/FloatingPanelWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { PanelButtonWidget } from '../forms/PanelButtonWidget';
import { Layer } from '../../stores/layer/LayerManager';
import { LayerDirectiveWidget } from '../../stores/layer/LayerDirectiveWidget';

export interface ColorPickerWidgetProps {
  color: string;
  colorChanged: (color: string) => any;
}

export interface ColorPickerWidgetState {
  show: boolean;
  openColor: string;
}

namespace S {
  export const Container = themed.div<{ selected: boolean }>`
    outline: none;
    border: solid 1px ${(p) => (p.selected ? p.theme.header.primary : p.theme.button.border)};
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
      border: none !important;
      box-shadow: none !important;
      user-select: none;
      -webkit-user-select: none;

      > div {
        background: transparent !important;
      }

      input {
        background: ${(p) => p.theme.forms.inputBackground} !important;
        color: ${(p) => p.theme.forms.inputForeground} !important;
        border: solid 1px ${(p) => p.theme.forms.inputBorder} !important;
        box-shadow: none !important;
        border-radius: 3px !important;
      }

      span{
        color: white !important;
      }

      label {
        color: ${(p) => p.theme.text.secondary} !important;
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
      }

      input {
        user-select: text;
        -webkit-user-select: text;
      }
    }

    .sketch-picker > .flexbox-fix:last-of-type {
      border-top: none !important;
    }
  `;

  export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
  `;
}

export class ColorPickerWidget extends React.Component<ColorPickerWidgetProps, ColorPickerWidgetState> {
  ref: React.RefObject<HTMLDivElement>;
  id: string;

  constructor(props: ColorPickerWidgetProps) {
    super(props);
    this.state = {
      show: false,
      openColor: props.color
    };
    this.id = v4();
    this.ref = React.createRef();
  }

  componentWillUnmount(): void {
    // no-op
  }

  mouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (this.state.show) {
      this.closePicker();
      return;
    }
    this.setState({
      show: true,
      openColor: this.props.color
    });
  };

  closePicker = () => {
    this.setState({
      show: false
    });
  };

  getFloatingPanel() {
    if (!this.state.show || !this.ref.current) {
      return null;
    }
    const pos = this.ref.current.getBoundingClientRect();
    return (
      <S.Floating
        position={{
          clientX: pos.x,
          clientY: pos.y
        }}
      >
        <FloatingPanelWidget center={false}>
          <ColorPickerOverlayWidget
            initialColor={this.props.color}
            openColor={this.state.openColor}
            colorChanged={this.props.colorChanged}
            closePicker={this.closePicker}
          />
        </FloatingPanelWidget>
      </S.Floating>
    );
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
        {this.state.show ? (
          <LayerDirectiveWidget
            gotLayer={(layer: Layer) => {
              const listener = layer.registerListener({
                dispose: () => {
                  this.closePicker();
                  listener();
                }
              });
            }}
          >
            {() => {
              return this.getFloatingPanel();
            }}
          </LayerDirectiveWidget>
        ) : null}
      </>
    );
  }
}

interface ColorPickerOverlayWidgetProps {
  initialColor: string;
  openColor: string;
  colorChanged: (color: string) => any;
  closePicker: () => any;
}

interface ColorPickerOverlayWidgetState {
  draftColor: string;
  lastCommittedColor: string;
}

interface SketchColorChange {
  hex: string;
  rgb?: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
}

const getColorValueFromPickerChange = (color: SketchColorChange): string => {
  const alpha = color.rgb?.a ?? 1;
  if (alpha < 1 && color.rgb) {
    return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`;
  }
  return color.hex;
};

class ColorPickerOverlayWidget extends React.Component<ColorPickerOverlayWidgetProps, ColorPickerOverlayWidgetState> {
  constructor(props: ColorPickerOverlayWidgetProps) {
    super(props);
    this.state = {
      draftColor: props.initialColor,
      lastCommittedColor: props.initialColor
    };
  }

  componentDidMount(): void {
    window.addEventListener('mouseup', this.commitDraftColor);
    window.addEventListener('touchend', this.commitDraftColor);
  }

  componentWillUnmount(): void {
    window.removeEventListener('mouseup', this.commitDraftColor);
    window.removeEventListener('touchend', this.commitDraftColor);
  }

  commitDraftColor = () => {
    if (this.state.draftColor === this.state.lastCommittedColor) {
      return;
    }
    this.setState(
      {
        lastCommittedColor: this.state.draftColor
      },
      () => {
        this.props.colorChanged(this.state.draftColor);
      }
    );
  };

  resetColor = () => {
    const resetColor = this.props.openColor || this.props.initialColor;
    this.setState({
      draftColor: resetColor,
      lastCommittedColor: resetColor
    });
    this.props.colorChanged(resetColor);
  };

  render() {
    return (
      <>
        <SketchPicker
          color={this.state.draftColor}
          styles={{
            default: {
              picker: {
                background: 'transparent',
                boxShadow: 'none'
              },
              controls: {
                borderTop: 'none',
                boxShadow: 'none'
              },
              saturation: {
                boxShadow: 'none'
              },
              hue: {
                boxShadow: 'none'
              },
              alpha: {
                boxShadow: 'none'
              },
              color: {
                boxShadow: 'none'
              },
              preset: {
                borderTop: 'none'
              }
            }
          }}
          onChange={(color: SketchColorChange) => {
            const nextColor = getColorValueFromPickerChange(color);
            this.setState({
              draftColor: nextColor
            });
          }}
        />
        <S.Footer>
          <PanelButtonWidget label="Reset" action={this.resetColor} />
          <PanelButtonWidget label="Close" action={this.props.closePicker} />
        </S.Footer>
      </>
    );
  }
}
