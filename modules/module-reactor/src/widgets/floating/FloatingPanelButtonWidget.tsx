import * as React from 'react';
import { useRef } from 'react';
import { Btn } from '../../definitions/common';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../icons/IconWidget';
import styled from '@emotion/styled';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { useButton } from '../../hooks/useButton';
import { setupTooltipProps, TooltipPosition } from '../info/tooltips';

export interface FloatingPanelButtonWidgetProps {
  btn: Btn;
  className?;
}

namespace S {
  export const Button = themed.div<{ primary: boolean; disabled?: boolean; highlight: boolean }>`
    border-radius: 3px;
    cursor: pointer;
    color: ${(p) => p.theme.combobox.text};
    font-size: 13px;
    padding: 4px 8px;
    border: solid 1px ${(p) =>
      p.highlight
        ? p.theme.guide.accent
        : p.primary
          ? p.theme.buttonPrimary.border
          : getTransparentColor(p.theme.combobox.text, 0.2)};
    display: flex;
    background-color: rgba(0, 0, 0, 0);
    margin-left: 5px;
    align-items: center;
    pointer-events: all;
    opacity: ${(p) => (p.disabled ? 0.5 : 1)};
    column-gap: 10px;

    &:hover {
      border-color: ${(p) => p.theme.combobox.text};
    }
  `;

  export const Label = styled.div`
    flex-grow: 1;
    user-select: none;
  `;

  export const Icon = styled.div`
    opacity: 0.4;
  `;
}

export const FloatingPanelButtonWidget: React.FC<FloatingPanelButtonWidgetProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { icon, attention, onClick, tooltip } = useButton({ btn: props.btn, forwardRef: ref });
  const label = props.btn.label || props.btn.tooltip;
  return (
    <S.Button
      highlight={!!attention}
      primary={props.btn.submitButton}
      {...setupTooltipProps({ tooltip: tooltip, tooltipPos: TooltipPosition.BOTTOM })}
      ref={ref}
      className={props.className}
      disabled={props.btn.disabled}
      onClick={onClick}
    >
      {label ? <S.Label>{label}</S.Label> : null}
      {icon ? (
        <S.Icon>
          <IconWidget {...icon} />
        </S.Icon>
      ) : null}
    </S.Button>
  );
};
