import * as React from 'react';
import { styled } from '../../../stores/themes/reactor-theme-fragment';
import { PanelBtn, PanelButtonWidget } from '../../forms/PanelButtonWidget';
import { BorderLayoutWidget } from '../../layout/BorderLayoutWidget';

export interface PanelWithFooterWidgetProps {
  btns: PanelBtn[];
}

export const PanelWithFooterWidget: React.FC<React.PropsWithChildren<PanelWithFooterWidgetProps>> = (props) => {
  return (
    <BorderLayoutWidget
      bottom={
        <S.Buttons>
          {props.btns.map((b) => {
            return <PanelButtonWidget key={b.label || b.tooltip} {...b} />;
          })}
        </S.Buttons>
      }
    >
      {props.children}
    </BorderLayoutWidget>
  );
};
namespace S {
  export const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 5px;
    column-gap: 2px;
    row-gap: 2px;
    flex-wrap: wrap;
    border-top: solid 1px ${(p) => p.theme.panels.searchBackground};
  `;
}
