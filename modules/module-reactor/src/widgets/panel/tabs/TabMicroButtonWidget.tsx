import * as React from 'react';
import { Btn } from '../../../definitions/common';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../../icons/IconWidget';

export interface TabMicroButtonWidgetProps {
  btn: Btn;
}

namespace S {
  export const Container = themed.div`
    background: ${(p) => p.theme.panels.background};
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    color: ${(p) => p.theme.panels.titleForeground};
    margin-right: 2px;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: ${(p) => p.theme.header.primary};
      color: white;
    }
  `;
}

export class TabMicroButtonWidget extends React.Component<TabMicroButtonWidgetProps> {
  render() {
    return (
      <S.Container
        onClick={(event) => {
          this.props.btn.action(event);
        }}
      >
        <IconWidget icon={this.props.btn.icon} />
      </S.Container>
    );
  }
}
