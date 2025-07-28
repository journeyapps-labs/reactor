import * as React from 'react';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import { ReactorIcon, IconWidget } from '../../icons/IconWidget';

export interface PanelPlaceholderWidgetProps {
  icon: ReactorIcon;
  text: string;
  children?: React.JSX.Element;
  center?: boolean;
}

namespace S {
  export const Center = themed.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  export const Container = themed.div`
    padding: 50px;
    display: flex;
    align-content: center;
    align-items: center;
    color: ${(p) => p.theme.text.primary};
    flex-direction: column;
  `;

  export const Icon = themed(IconWidget)`
    font-size: 40px;
    color: ${(p) => p.theme.text.secondary};
  `;

  export const Text = themed.div`
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
    color: ${(p) => p.theme.text.secondary};
    margin-bottom: 10px;
    user-select: none;
  `;
}

export class PanelPlaceholderWidget extends React.Component<PanelPlaceholderWidgetProps> {
  getContent() {
    return (
      <S.Container>
        <S.Icon icon={this.props.icon} />
        <S.Text>{this.props.text}</S.Text>
        {this.props.children}
      </S.Container>
    );
  }

  render() {
    if (this.props.center) {
      return <S.Center>{this.getContent()}</S.Center>;
    }
    return this.getContent();
  }
}
