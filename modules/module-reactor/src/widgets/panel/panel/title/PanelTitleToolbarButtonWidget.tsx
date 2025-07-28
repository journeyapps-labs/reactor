import * as React from 'react';
import { Btn } from '../../../../definitions/common';
import { setupTooltipProps, TooltipPosition } from '../../../info/tooltips';
import { IconWidget } from '../../../icons/IconWidget';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { styled, theme } from '../../../../stores/themes/reactor-theme-fragment';
import { css } from '@emotion/react';
import { useButton } from '../../../../hooks/useButton';
import { observer } from 'mobx-react';
import { ThemeStore } from '../../../../stores/themes/ThemeStore';
import { ioc } from '../../../../inversify.config';
import { ValidationResult } from '../../../../actions';

export interface PanelTitleToolbarButtonProps extends Btn {
  enabled?: boolean;
  showLabel?: boolean;
}

namespace S {
  const BUTTON_HEIGHT = 20;

  export const Common = css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    margin-left: 2px;
    white-space: nowrap;
    border: solid 1px transparent;
    height: ${BUTTON_HEIGHT}px;
  `;

  export const Button = styled.div<{ enabled: boolean; border: string }>`
    ${Common};
    width: ${BUTTON_HEIGHT}px;
    background: ${(p) =>
      p.enabled ? getTransparentColor(p.theme.tabs.selectedAccent, 0.2) : p.theme.panels.titleBackground};
    color: ${(p) =>
      p.enabled ? p.theme.panels.titleForeground : getTransparentColor(p.theme.panels.titleForeground, 0.4)};
    border-color: ${(p) => p.border};

    &:hover {
      color: ${(p) => p.theme.panels.titleForeground};
    }
  `;

  export const ButtonWithLabel = styled.div<{ attention: boolean; border: string; validation: ValidationResult }>`
    ${Common};
    border-color: ${(p) => p.border};
    padding-left: 6px;
    padding-right: 2px;
    background: ${(p) => p.theme.panels.titleBackground};
    color: ${(p) => getTransparentColor(p.theme.panels.titleForeground, 0.4)};

    &:hover {
      color: ${(p) => p.theme.panels.titleForeground};
    }
  `;

  export const ButtonIcon = styled(IconWidget)`
    font-size: ${BUTTON_HEIGHT - 7}px;
  `;

  export const Label = styled.div`
    font-size: ${BUTTON_HEIGHT - 7}px;
    margin-right: 2px;
  `;
}

export const PanelTitleToolbarButtonWidget: React.FC<PanelTitleToolbarButtonProps> = observer((props) => {
  let { onClick, attention, icon, ref, validationResult, border } = useButton({
    btn: props
  });
  const themeValues = ioc.get(ThemeStore).getCurrentTheme(theme);
  let color = 'transparent';
  if (!!attention) {
    color = themeValues.guide.accent;
  } else if (border) {
    color = border;
  } else if (props.enabled) {
    color = themeValues.tabs.selectedAccentSingle;
  }

  if (props.label) {
    return (
      <S.ButtonWithLabel
        validation={validationResult}
        border={color}
        ref={ref}
        attention={!!attention}
        onClick={onClick}
      >
        <S.Label>{props.label}</S.Label>
        {icon ? <S.ButtonIcon {...icon} /> : null}
      </S.ButtonWithLabel>
    );
  }

  return (
    <S.Button
      border={color}
      ref={ref}
      onClick={onClick}
      {...setupTooltipProps({
        ...props,
        tooltipPos: TooltipPosition.BOTTOM_RIGHT
      })}
      enabled={props.enabled}
    >
      {icon ? <S.ButtonIcon {...icon} /> : null}
    </S.Button>
  );
});
