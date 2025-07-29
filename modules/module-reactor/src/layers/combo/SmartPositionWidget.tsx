import * as React from 'react';
import styled from '@emotion/styled';
import * as _ from 'lodash';

export interface MousePosition {
  clientX: number;
  clientY: number;
}

export interface SmartPositionWidgetProps {
  position: MousePosition;
  className?: any;
  animate?: boolean;
}

namespace S {
  export const Box = styled.div<{ animate?: boolean }>`
    position: absolute;
    ${(p) => (p.animate ? `transition: top 0.3s, left 0.3s` : '')};
  `;
}

export class SmartPositionWidget extends React.Component<React.PropsWithChildren<SmartPositionWidgetProps>> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    if (!this.props.position) {
      this.state = {
        left: '50%',
        top: '50%'
      };
    }
  }

  getStyle(): Partial<CSSStyleDeclaration> {
    if (!this.props.position) {
      return { top: '50%', left: '50%' };
    }
    if (this.ref.current) {
      const rect = this.ref.current.getBoundingClientRect();

      let x = this.props.position.clientX;
      if (x + rect.width > document.body.offsetWidth) {
        x = x - rect.width - 10;
      }

      let y = this.props.position.clientY;
      if (y + rect.height > document.body.offsetHeight) {
        y = y - rect.height - 10;
      }

      return {
        left: `${x}px`,
        top: `${y}px`
      };
    }
    return {
      left: `${this.props.position.clientX}px`,
      top: `${this.props.position.clientY}px`
    };
  }

  reposition() {
    if (this.ref.current) {
      const s = this.getStyle();
      this.ref.current.style.top = s.top;
      this.ref.current.style.left = s.left;
    }
  }

  componentDidMount(): void {
    _.defer(() => {
      this.reposition();
    });
  }

  componentDidUpdate(): void {
    this.reposition();
  }

  render() {
    return (
      <S.Box animate={this.props.animate} className={this.props.className} ref={this.ref}>
        {this.props.children}
      </S.Box>
    );
  }
}
