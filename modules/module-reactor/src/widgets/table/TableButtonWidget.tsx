import * as React from 'react';
import { ButtonWidgetIcon, useSubmit } from '../forms/buttons';
import { Btn } from '../../definitions/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';

namespace S {
  export const ButtonContainer = themed.div`
      background: ${(p) => p.theme.table.pills};
      padding: 1px 6px;
      font-size: 13px;
      color: ${(p) => p.theme.text.primary};
      border-radius: 3px;
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

export const TableButtonWidget: React.FC<Btn & { className? }> = observer((props) => {
  const controls = useSubmit(props);
  return (
    <S.ButtonContainer
      className={props.className}
      {...(props.tooltip
        ? {
            'aria-label': props.tooltip,
            'data-balloon-pos': props.tooltipPos || 'up'
          }
        : {})}
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
  );
});
