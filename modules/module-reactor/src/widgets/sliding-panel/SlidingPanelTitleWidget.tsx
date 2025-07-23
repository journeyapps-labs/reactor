import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

export interface SlidingPanelTitleWidgetProps {
  title: string;
  back: () => any;
}

namespace S {
  export const Container = themed.div`
      background: ${(p) => p.theme.panels.titleBackground};
      display: flex;
      align-items: center;
      padding: 2px;
  `;

  export const Icon = themed.div`
    background: ${(p) => p.theme.panels.background};
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 20px;
    color: white;
    cursor: pointer;
  `;

  export const Title = themed.div`
    margin-left: 10px;
    font-size: 15px;
    margin-right: 10px;
    color: ${(p) => p.theme.combobox.text}
  `;
}

export class SlidingPanelTitleWidget extends React.Component<SlidingPanelTitleWidgetProps> {
  render() {
    return (
      <S.Container>
        <S.Icon
          onClick={() => {
            this.props.back();
          }}
        >
          <FontAwesomeIcon icon="angle-left" />
        </S.Icon>
        <S.Title>{this.props.title}</S.Title>
      </S.Container>
    );
  }
}
