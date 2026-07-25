import * as React from 'react';
import { ButtonWidgetIcon, useSubmit } from '../forms/buttons';
import { Btn } from '../../definitions/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { ReactorTooltipWidget, TooltipPosition } from '../info/tooltips';
import { size, getReactorBorderRadius, Size, useReactorSize } from '../../hooks/useReactorSize';

namespace S {
  export const ButtonContainer = themed.div<{ $size: Size }>`
      background: ${(p) => p.theme.table.pills};
      padding: ${(p) => size(p, ['1px 6px', '2px 8px', '4px 10px'])};
      font-size: ${(p) => size(p, ['13px', '14px', '15px'])};
      color: ${(p) => p.theme.text.primary};
      border-radius: ${(p) => getReactorBorderRadius(p.$size)}px;
      opacity: 0.4;
      cursor: pointer;
      &:hover{
        opacity: 1;
      }
  `;

  export const ButtonLabel = styled.div`
    font-size: 13px;
    user-select: none;
    white-space: nowrap;
  `;

  export const ButtonIcon = styled.div<{ hasLabel: boolean }>`
    opacity: 0.3;
    margin-left: ${(p) => (p.hasLabel ? 8 : 0)}px;
  `;
}

export const TableButtonWidget: React.FC<Btn & { className?; size?: Size }> = observer((props) => {
  const size = useReactorSize(props.size);
  const controls = useSubmit(props);
  return (
    <ReactorTooltipWidget tooltip={props.tooltip} tooltipPos={props.tooltipPos || TooltipPosition.TOP}>
      <S.ButtonContainer
        $size={size}
        className={props.className}
        {...(props.tooltip ? { 'aria-label': props.tooltip } : {})}
        onClick={(event) => {
          event.persist();
          event.stopPropagation();
          controls.action(event);
        }}
      >
        <S.ButtonLabel>{props.label}</S.ButtonLabel>
        {props.icon ? (
          <S.ButtonIcon hasLabel={!!props.label}>
            <ButtonWidgetIcon icon={props.icon} loading={controls.blocking} />
          </S.ButtonIcon>
        ) : null}
      </S.ButtonContainer>
    </ReactorTooltipWidget>
  );
});
