import * as React from 'react';
import { Btn } from '../../definitions/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import Color from 'color';
import { IconWidget } from '../icons/IconWidget';

export interface FloatingToolbarBtnWidgetProps {
  btn: Btn;
}

namespace S {
  export const Container = themed.div`
      background: ${(p) => new Color(p.theme.combobox.text).alpha(0.1).toString()};
      font-size: 12px;
      padding: 2px 5px;
      border-radius: 5px;
      color: ${(p) => p.theme.combobox.text};
      cursor: pointer;
      margin-top: 5px;
  `;
}

export class FloatingToolbarBtnWidget extends React.Component<FloatingToolbarBtnWidgetProps> {
  getContent() {
    if (this.props.btn.icon) {
      return <IconWidget icon={this.props.btn.icon} />;
    }
    return this.props.btn.tooltip;
  }

  render() {
    return (
      <S.Container
        onClick={(event) => {
          event.persist();
          this.props.btn.action(event);
        }}
      >
        {this.getContent()}
      </S.Container>
    );
  }
}
