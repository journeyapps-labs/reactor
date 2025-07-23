import styled from '@emotion/styled';
import React, { useRef } from 'react';
import { CheckboxWidget, CheckboxWidgetProps } from './CheckboxWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { useAttention } from '../guide/AttentionWrapperWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../stores/guide/selections/common';
import { css } from '@emotion/react';

export interface CheckboxLabelWidgetProps extends CheckboxWidgetProps {
  label: string;
  className?;
  disabled?: boolean;
}

namespace S {
  export const Highlighted = css`
    border-radius: 5px;
    padding: 2px 5px;
    margin-bottom: 5px;
  `;

  export const Container = themed.div<{ disabled: boolean; highlighted: boolean }>`
    display: flex;
    align-items: center;
    opacity: ${(p) => (p.disabled ? 0.3 : 1)};
    pointer-events: ${(p) => (p.disabled ? 'none' : 'all')};
    color: ${(p) => p.theme.text.primary};
    ${(p) => (p.highlighted ? Highlighted : '')};
    ${(p) => (p.highlighted ? `border: solid 2px ${p.theme.guide.accent}` : 'transparent')};
  `;

  export const Label = styled.div`
    font-size: 14px;
    margin-left: 5px;
    cursor: pointer;
    user-select: none;
  `;
}
export const CheckboxLabelWidget: React.FC<CheckboxLabelWidgetProps> = (props) => {
  const ref = useRef(null);
  const attention = useAttention<ButtonComponentSelection>({
    type: ReactorComponentType.CHECKBOX,
    forwardRef: ref,
    selection: {
      label: props.label
    }
  });

  return (
    <S.Container highlighted={!!attention} ref={ref} disabled={props.disabled} className={props.className}>
      <CheckboxWidget {...props} />
      <S.Label
        onClick={(event) => {
          event.stopPropagation();
          props.onChange(!props.checked);
        }}
      >
        {props.label}
      </S.Label>
    </S.Container>
  );
};
