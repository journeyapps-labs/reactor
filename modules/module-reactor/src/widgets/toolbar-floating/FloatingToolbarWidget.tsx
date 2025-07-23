import * as React from 'react';
import { keyframes } from '@emotion/react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface FloatingToolbarWidgetProps {
  name: string;
  defaultActive?: boolean;
  activeChanged?: (active: boolean) => any;
}

export interface FloatingToolbarWidgetState {
  active: boolean;
}

namespace S {
  export const animation = keyframes`
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  `;

  export const Container = themed.div<{ active: boolean }>`
      border-radius: 5px;
      background: ${(p) => p.theme.floating.background};
      opacity: ${(p) => (p.active ? 1 : 0.5)};
      padding: 4px;
      user-select: none;
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      box-shadow: 0 0 20px ${(p) => p.theme.floating.backgroundInactive};
  `;

  export const TitleBar = themed.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 5px;
    padding-right: 5px;
    cursor: pointer;
  `;

  export const Title = themed.div`
    font-size: 14px;
    color: ${(p) => p.theme.combobox.text};
    margin-right: 10px;

  `;
  export const Icon = styled(FontAwesomeIcon)`
    color: white;
    opacity: 0.5;
    font-size: 12px;
  `;
  export const Content = styled.div`
    animation: ${animation} 0.5s ease-out;
    margin-top: 5px;

    *::-webkit-scrollbar {
      width: 10px;
    }
    *::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }
  `;
}

export class FloatingToolbarWidget extends React.Component<
  React.PropsWithChildren<FloatingToolbarWidgetProps>,
  FloatingToolbarWidgetState
> {
  constructor(props: FloatingToolbarWidgetProps) {
    super(props);
    this.state = {
      active: !!props.defaultActive
    };
  }

  getContent() {
    if (!this.state.active) {
      return null;
    }
    return <S.Content>{this.props.children}</S.Content>;
  }

  render() {
    return (
      <S.Container active={this.state.active}>
        <S.TitleBar
          onClick={() => {
            this.setState(
              {
                active: !this.state.active
              },
              () => {
                this.props.activeChanged?.(this.state.active);
              }
            );
          }}
        >
          <S.Title>{this.props.name}</S.Title>
          <S.Icon rotation={this.state.active ? 90 : null} icon="play" />
        </S.TitleBar>
        {this.getContent()}
      </S.Container>
    );
  }
}
