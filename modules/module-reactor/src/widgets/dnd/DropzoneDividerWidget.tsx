import * as React from 'react';
import styled from '@emotion/styled';
import { JOURNEY_MIME } from './DraggableWidget';
import { SerializedAction } from '../../actions/Action';
import { css } from '@emotion/react';
import { SerializedEntity } from '../../providers/Provider';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface DropzoneDividerWidgetProps {
  size?: number;
  dropped?: (entity: SerializedEntity | SerializedAction) => any;
  vertical: boolean;
}

export interface DropzoneDividerWidgetState {
  hover: boolean;
}

namespace S {
  const _Container = css`
    position: relative;
    transition:
      width 0.2s,
      height 0.2s;
    align-self: stretch;
  `;

  export const ContainerH = themed.div<{ enter: boolean; size: number }>`
    ${_Container};
    width: ${(p) => (p.enter ? p.size : 0)}px;
    background: ${(p) => p.theme.panels.trayBackground};
  `;

  export const ContainerV = themed.div<{ enter: boolean; size: number }>`
    ${_Container};
    height: ${(p) => (p.enter ? p.size : 0)}px;
    background: ${(p) => p.theme.panels.trayBackground};
  `;

  const _Overlay = css`
    position: absolute;
    z-index: 2;
    transition:
      width 0.2s,
      height 0.2s;
    //border: solid 1px red;
  `;

  export const OverlayH = styled.div<{ enter: boolean; size: number }>`
    ${_Overlay};
    left: 50%;
    transform: translateX(-50%);
    width: ${(p) => (p.enter ? p.size * 2 : p.size)}px;
    height: 100%;
  `;

  export const OverlayV = styled.div<{ enter: boolean; size: number }>`
    ${_Overlay};
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: ${(p) => (p.enter ? p.size * 2 : p.size)}px;
  `;
}
/**
 * @deprecated
 */
export class DropzoneDividerWidget extends React.Component<DropzoneDividerWidgetProps, DropzoneDividerWidgetState> {
  constructor(props: DropzoneDividerWidgetProps) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const Container: any = {
      size: this.props.size || 30,
      enter: this.state.hover
    };
    const Innner: any = {
      size: this.props.size || 30,
      enter: this.state.hover,
      onDragLeave: () => {
        this.setState({
          hover: false
        });
      },
      onDrop: (event) => {
        let data = event.dataTransfer.getData(JOURNEY_MIME);
        let object = JSON.parse(data);
        this.props.dropped(object);
      },
      onDragOver: () => {
        if (!this.state.hover) {
          this.setState({
            hover: true
          });
        }
      }
    };

    if (this.props.vertical) {
      return (
        <S.ContainerV {...Container}>
          <S.OverlayV {...Innner} />
        </S.ContainerV>
      );
    }

    return (
      <S.ContainerH {...Container}>
        <S.OverlayH {...Innner} />
      </S.ContainerH>
    );
  }
}
