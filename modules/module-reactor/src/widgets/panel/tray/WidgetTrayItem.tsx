import * as React from 'react';
import { IconWidget, ReactorIcon } from '../../icons/IconWidget';
import { styled, themed } from '../../../stores/themes/reactor-theme-fragment';

export interface WidgetTrayItemProps {
  name: string;
  icon: ReactorIcon;
  selected: boolean;
}

export interface WidgetTrayItemState {
  width: number;
}

namespace S {
  export const Item = styled.div<{ height: number }>`
    min-height: ${(p) => p.height || 100}px;
    text-align: left;
    overflow: hidden;
  `;

  export const Rotated = styled.div<{ height: number }>`
    transform: translateY(${(p) => p.height}px) rotateZ(-90deg);
    display: flex;
    align-items: center;
  `;

  export const Title = styled.div<{ selected: boolean }>`
    color: ${(p) => (p.selected ? p.theme.panels.tabForegroundSelected : p.theme.panels.tabForeground)};
    font-size: 13px;
    white-space: nowrap;
  `;

  export const Icon = themed(IconWidget)<{ selected: boolean }>`
    color: ${(p) => (p.selected ? p.theme.panels.itemIconColorSelected : p.theme.panels.tabForeground)};
    padding-right: 8px;
    font-size: 15px;
  `;

  export const Hidden = styled.div`
    position: fixed;
    visibility: hidden;
  `;

  export const Container = styled.div<{ selected: boolean }>`
    cursor: pointer;
    flex-shrink: 0;
    width: 30px;
    background: ${(p) => (p.selected ? p.theme.panels.trayButtonSelected : p.theme.panels.trayButton)};
    margin-bottom: 2px;
    user-select: none;
    padding-bottom: 4px;
  `;
}

export class WidgetTrayItem extends React.PureComponent<WidgetTrayItemProps, WidgetTrayItemState> {
  constructor(props) {
    super(props);
    this.state = {
      width: null
    };
  }

  render() {
    if (this.state.width == null) {
      return (
        <S.Hidden
          ref={(ref) => {
            if (ref) {
              this.setState({
                width: ref.getBoundingClientRect().width + 60
              });
            }
          }}
        >
          <S.Icon selected={false} icon={this.props.icon} />
          <S.Title selected={false}>{this.props.name}</S.Title>
        </S.Hidden>
      );
    }
    return (
      <S.Container selected={this.props.selected}>
        <S.Item height={this.state.width}>
          <S.Rotated height={this.state.width - 30}>
            <S.Icon selected={this.props.selected} icon={this.props.icon} />
            <S.Title selected={this.props.selected}>{this.props.name}</S.Title>
          </S.Rotated>
        </S.Item>
      </S.Container>
    );
  }
}
