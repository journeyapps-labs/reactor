import * as React from 'react';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export interface AssetsTreeWidgetProps {
  dropped: (files: File[]) => any;
}

export interface AssetsTreeWidgetState {
  dragging: boolean;
  items: number;
}

namespace S {
  export const Animated = keyframes`
      0%{
        opacity: 0.3;
      }
      100%{
        opacity: 1.0;
      }
  `;

  export const Drop = styled.div`
    position: relative;
  `;

  export const DropZone = styled.div`
    background: mediumpurple;
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${Animated} 0.5s infinite alternate;
  `;
}

@observer
export class TreeDropZoneWidget extends React.Component<
  React.PropsWithChildren<AssetsTreeWidgetProps>,
  AssetsTreeWidgetState
> {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      items: 0
    };
  }

  getDropZone() {
    if (!this.state.dragging) {
      return null;
    }
    return (
      <S.DropZone
        onDragOver={(event) => {
          event.preventDefault();
          if (this.state.items !== event.dataTransfer.files.length) {
            this.setState({
              items: event.dataTransfer.files.length
            });
          }
        }}
        onDrop={(event) => {
          event.persist();
          event.preventDefault();
          let files = [];
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
            const file = event.dataTransfer.files[i];
            files.push(file);
          }
          this.props.dropped(files);
          this.setState({
            dragging: false
          });
        }}
        onDragLeave={() => {
          this.setState({
            dragging: false
          });
        }}
      />
    );
  }

  render() {
    return (
      <S.Drop
        onDragEnter={(event) => {
          this.setState({
            dragging: true
          });
        }}
      >
        {this.props.children}
        {this.getDropZone()}
      </S.Drop>
    );
  }
}
