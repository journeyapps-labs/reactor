import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import styled from '@emotion/styled';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TreeItemWidgetProps {
  name: string;
  draggable?: boolean;
  icon: IconName;
  rightClick?: (event) => any;
  onClick?: (e: any) => any;
  selected?: boolean;
}

namespace S {
  export const Container = themed.div<{ selected: boolean }>`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
    background: ${(p) => (p.selected ? p.theme.panels.trayBackground : 'transparent')};

    &:hover {
      opacity: 1;
    }
  `;

  export const Name = styled.div`
    margin-left: 5px;
    color: white;
    font-size: 15px;
    white-space: nowrap;
  `;

  export const FA = styled(FontAwesomeIcon)`
    font-size: 12px;
    margin-left: 15px;
    color: white;
    opacity: 0.2;
  `;
}

export class TreeItemWidget extends React.PureComponent<TreeItemWidgetProps> {
  render() {
    return (
      <S.Container
        selected={this.props.selected}
        onClick={this.props.onClick}
        draggable={this.props.draggable}
        onContextMenu={(event) => {
          event.preventDefault();
          this.props.rightClick && this.props.rightClick(event);
        }}
      >
        <S.FA icon={this.props.icon} />
        <S.Name>{this.props.name}</S.Name>
      </S.Container>
    );
  }
}
