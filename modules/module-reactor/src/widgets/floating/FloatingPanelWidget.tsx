import { css, keyframes } from '@emotion/react';
import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../hooks/useReactorViewportMode';

export interface FloatingPanelWidgetProps {
  center: boolean;
  className?: string;
  highlight?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement>;
  scaleInOnMobile?: boolean;
}

namespace S {
  const mobileScaleIn = keyframes`
    0% {
      opacity: 0;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `;

  const mobileScaleInAnimation = css`
    ${mobileScaleIn} 220ms ease-out both
  `;

  const center = css`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;

  export const Container = themed.div<{ center: boolean; highlight: boolean; scaleInOnMobile?: boolean }>`
    background: ${(p) => p.theme.combobox.background};
    border: solid 1px ${(p) => p.theme.combobox.border};
    border-radius: 4px;
    padding: 2px;
    box-shadow: 0 0 20px ${(p) => p.theme.combobox.shadowColor};
    ${(p) => p.center && center};

    ${(p) => (p.highlight ? `border: solid 2px ${p.theme.guide.accent}` : ``)};

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      min-height: 0;
      overflow: hidden;
      animation: ${(p) => (p.scaleInOnMobile ? mobileScaleInAnimation : 'none')};
      transform-origin: center;
    }

    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      padding-left: 3px;
    }
    *::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      border-left: solid 2px ${(p) => p.theme.combobox.background};
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }
    *::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
}

export class FloatingPanelWidget extends React.Component<React.PropsWithChildren<FloatingPanelWidgetProps>> {
  render() {
    return (
      <S.Container
        ref={this.props.forwardRef}
        highlight={this.props.highlight}
        className={this.props.className}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        center={this.props.center}
        scaleInOnMobile={this.props.scaleInOnMobile}
      >
        {this.props.children}
      </S.Container>
    );
  }
}
