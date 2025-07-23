import * as React from 'react';
import { FloatingPanelWidget } from './FloatingPanelWidget';
import styled from '@emotion/styled';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Btn, FloatingPanelButtonWidget } from '../..';

export interface FloatingInspectorPanelWidgetProps {
  primaryHeading: string;
  secondaryHeading: string;
  btns: Btn[];
  className?: any;
}

namespace S {
  export const Container = styled(FloatingPanelWidget)`
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  `;

  export const Top = themed.div`
    height: 40px;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    user-select: none;
    background: ${(p) => p.theme.combobox.headerBackground};
    color: ${(p) => p.theme.combobox.headerForeground} !important;
  `;

  export const PrimaryHeading = styled.div`
    font-weight: bold;
  `;

  export const SecondaryHeading = themed.div`
    opacity: 0.8;
    border-left: solid 1px ${(p) => p.theme.combobox.text};
    padding-left: 10px;
    margin-left: 10px;
  `;

  export const Content = themed.div`
    color: ${(p) => p.theme.combobox.text} !important;
    overflow-y: auto;
  `;

  export const Buttons = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    justify-content: flex-end;
  `;
}

export class FloatingInspectorPanelWidget extends React.Component<
  React.PropsWithChildren<FloatingInspectorPanelWidgetProps>
> {
  render() {
    return (
      <S.Container center={true} className={this.props.className}>
        <S.Top>
          <S.PrimaryHeading>{this.props.primaryHeading}</S.PrimaryHeading>
          <S.SecondaryHeading>{this.props.secondaryHeading}</S.SecondaryHeading>
        </S.Top>
        <S.Content>{this.props.children}</S.Content>
        <S.Buttons>
          {this.props.btns.map((btn) => {
            return <FloatingPanelButtonWidget key={btn.label} btn={btn} />;
          })}
        </S.Buttons>
      </S.Container>
    );
  }
}
