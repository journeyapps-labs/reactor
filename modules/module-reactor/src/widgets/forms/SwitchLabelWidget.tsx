import styled from '@emotion/styled';
import React from 'react';
import { Switch, SwitchWidgetProps } from './Switch';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface SwitchLabelWidgetProps extends SwitchWidgetProps {
  label: string;
}

namespace S {
  export const Container = themed.div`
    display: flex;
    align-items: center;
    color: ${(p) => p.theme.text.primary};
  `;

  export const Label = styled.div`
    font-size: 14px;
    margin-right: 5px;
    cursor: pointer;
    user-select: none;
  `;
}

export const SwitchLabelWidget: React.FC<SwitchLabelWidgetProps> = (props) => {
  return (
    <S.Container>
      <S.Label
        onClick={(event) => {
          event.stopPropagation();
          props.onChange(!props.checked);
        }}
      >
        {props.label}
      </S.Label>
      <Switch {...props} />
    </S.Container>
  );
};
