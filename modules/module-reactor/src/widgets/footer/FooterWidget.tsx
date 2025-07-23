import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { SmartVisorWidget } from '../visor/SmartVisorWidget';
import { observer } from 'mobx-react';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { Btn } from '../../definitions/common';
import styled from '@emotion/styled';
import { FooterButtonWidget } from './FooterButtonWidget';
import { SmartFooterLoaderWidget } from './SmartFooterLoaderWidget';

namespace S {
  export const Footer = themed.div<{ shadow: boolean }>`
    flex-grow: 0;
    flex-shrink: 0;
    background: ${(p) => p.theme.footer.background};
    box-shadow: ${(p) => (p.shadow ? '0 0 10px rgba(0,0,0,0.3)' : 'none')};
    z-index: ${(p) => (p.shadow ? 1 : 'inherit')};
    margin-top: 2px;
  `;

  export const Buttons = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-self: stretch;
  `;

  export const Container = themed.div<{ shadow: boolean }>`
    display: flex;
    min-height: 40px;
    background: ${(p) => p.theme.footer.background};
    align-items: center;
    box-shadow: ${(p) => (p.shadow ? '0 0 10px rgba(0,0,0,0.3)' : 'none')};
    padding-left: 5px;
  `;
}

export interface FooterWidgetProps {
  btns?: Btn[];
}

@observer
export class FooterWidget extends React.Component<React.PropsWithChildren<FooterWidgetProps>> {
  getBtns() {
    if (this.props.btns?.length > 0) {
      return (
        <S.Buttons>
          {this.props.btns.map((btn) => {
            return <FooterButtonWidget {...btn} key={btn.label || btn.tooltip} />;
          })}
        </S.Buttons>
      );
    }
    return null;
  }

  render() {
    return (
      <S.Footer shadow={!AdvancedWorkspacePreference.enabled()}>
        <S.Container shadow={!AdvancedWorkspacePreference.enabled()}>
          <SmartVisorWidget />
          {this.props.children}
          {this.getBtns()}
        </S.Container>
        <SmartFooterLoaderWidget />
      </S.Footer>
    );
  }
}
