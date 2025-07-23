import * as React from 'react';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import * as _ from 'lodash';
import { Btn } from '../../../definitions/common';
import { PanelButtonMode, PanelButtonWidget } from '../../forms/PanelButtonWidget';
import styled from '@emotion/styled';
import { ReadOnlyMetadataWidgetProps } from '../../meta/ReadOnlyMetadataWidget';
import { MetaBarWidget } from '../../meta/MetaBarWidget';

export interface PanelToolbarWidgetProps {
  meta?: ReadOnlyMetadataWidgetProps[];
  btns?: Btn[];
  className?;
}

namespace S {
  export const Container = themed.div`
    background: ${(p) => p.theme.panels.trayBackground};
    padding: 5px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  `;

  export const Buttons = styled.div`
    display: flex;
    align-items: center;
    margin-right: 30px;
  `;

  export const PanelButton = styled(PanelButtonWidget)`
    margin-right: 5px;

    &:last-of-type {
      margin-right: 0;
    }
  `;
}

export class PanelToolbarWidget extends React.Component<PanelToolbarWidgetProps> {
  getButtons() {
    if (this.props.btns?.length > 0) {
      return (
        <S.Buttons>
          {_.map(this.props.btns || [], (btn) => {
            return <S.PanelButton key={btn.label} {...btn} mode={PanelButtonMode.LINK} />;
          })}
        </S.Buttons>
      );
    }
    return null;
  }

  render() {
    return (
      <S.Container className={this.props.className}>
        {this.getButtons()}
        <MetaBarWidget meta={this.props.meta} />
      </S.Container>
    );
  }
}
