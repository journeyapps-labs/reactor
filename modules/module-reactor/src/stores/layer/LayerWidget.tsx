import * as React from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { observer } from 'mobx-react';
import { inject } from '../../inversify.config';
import { NotificationStore, NotificationType } from '../NotificationStore';

export interface LayerWidgetProps {
  zIndex: number;
  animate: boolean;
  clickThough: () => boolean;
  hide: () => any;
}

export const LAYER_ANIMATION_DURATION = 500;

namespace S {
  const fade = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  `;

  export const Layer = styled.div<{ index: number; animate: boolean; clickThrough: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: ${(p) => p.index};
    pointer-events: ${(p) => (p.clickThrough ? 'none' : 'all')};
    animation: ${(p) =>
      p.animate
        ? css`
            ${fade} 0.3s
          `
        : 'none'};
    transition: opacity ${LAYER_ANIMATION_DURATION / 1000}s;

    // for iPad
    overflow: hidden;
  `;
}

export const LayerWidget: React.FC<React.PropsWithChildren<LayerWidgetProps>> = observer((props) => {
  const clickThrough = props.clickThough();

  return (
    <S.Layer
      onContextMenu={(e) => {
        e.preventDefault();
        props.hide();
      }}
      onMouseDown={(event) => {
        props.hide();
      }}
      animate={props.animate}
      index={props.zIndex}
      clickThrough={clickThrough}
    >
      {props.children}
    </S.Layer>
  );
});

export class LayerWidgetErrorBoundary extends React.Component<
  React.PropsWithChildren<LayerWidgetProps>,
  { error: boolean }
> {
  @inject(NotificationStore)
  accessor notificationStore: NotificationStore;

  constructor(props: LayerWidgetProps) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error: true
    });
    this.notificationStore.showNotification({
      type: NotificationType.ERROR,
      title: 'Aw snap',
      description: 'Something went wrong trying to show this content in a layer'
    });
    this.props.hide();
  }

  render() {
    if (this.state.error) {
      return null;
    }
    return <LayerWidget {...this.props} />;
  }
}
