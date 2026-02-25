import { observer } from 'mobx-react';
import * as React from 'react';
import { useRef } from 'react';
import { Btn } from '../../definitions/common';
import { useButton } from '../../hooks/useButton';
import { GetTheme } from '../../stores/themes/ThemeFragment';
import { styled, theme } from '../../stores/themes/reactor-theme-fragment';
import { IconWidget } from '../icons/IconWidget';
import { ioc } from '../../inversify.config';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { setupTooltipProps, TooltipPosition } from '../info/tooltips';

namespace S {
  export const getMode = (p: { mode: PanelButtonMode; theme: GetTheme<typeof theme> }) => {
    if (!p.mode || p.mode === PanelButtonMode.NORMAL) {
      return p.theme.button;
    }
    if (p.mode === PanelButtonMode.LINK) {
      return p.theme.buttonLink;
    }
    return p.theme.buttonPrimary;
  };

  export const ButtonLabel = styled.div<{ mode: PanelButtonMode }>`
    font-size: 14px;
    user-select: none;
    white-space: nowrap;
  `;

  export const ButtonContainer = styled.div<{ disabled?: boolean; mode: PanelButtonMode; selected: boolean }>`
    background: ${(p) => getMode(p).background};
    display: inline-flex;
    column-gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    border: solid 1px ${(p) => (p.selected ? p.theme.guide.accent : getMode(p).border)};
    border-radius: 3px;
    color: ${(p) => getMode(p).color};
    box-sizing: border-box;
    height: 28px;
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

    &:hover {
      background: ${(p) => getMode(p).background};
      color: ${(p) => getMode(p).colorHover};
    }

    > div {
      ${(props) => (props.disabled ? 'opacity: .3' : '')};
    }
  `;

  export const Icon = styled(IconWidget)<{ iconColor: string; disabled: boolean; mode: PanelButtonMode }>`
    color: ${(p) => (p.disabled ? p.iconColor : p.iconColor || getMode(p).icon)};
    ${(props) => (props.disabled ? 'opacity: .3' : '')};
    max-height: 16px;
  `;
}

export interface PanelBtn extends Btn {
  mode?: PanelButtonMode;
  iconColor?: string;
}

export enum PanelButtonMode {
  PRIMARY = 'primary',
  NORMAL = 'normal',
  LINK = 'link'
}

export const PanelButtonWidget: React.FC<
  PanelBtn & {
    className?: string;
  }
> = observer((props) => {
  const ref = props.forwardRef || useRef(null);
  const { onClick, icon, attention, disabled, tooltip } = useButton({ btn: props, forwardRef: ref });
  const _theme = ioc.get(ThemeStore).getCurrentTheme(theme);

  // if it's just the icon showing, use the text color instead
  let iconColor = icon?.color;
  if (!props.label && !iconColor) {
    iconColor = S.getMode({
      mode: props.mode,
      theme: _theme
    }).color;
  }

  return (
    <S.ButtonContainer
      ref={ref}
      selected={!!attention}
      mode={!disabled ? props.mode : null}
      disabled={disabled}
      className={props.className}
      {...setupTooltipProps({ tooltip: tooltip, tooltipPos: props.tooltipPos || TooltipPosition.BOTTOM })}
      onClick={(event) => {
        onClick(event);
      }}
    >
      {props.label ? <S.ButtonLabel mode={props.mode}>{props.label}</S.ButtonLabel> : null}
      {icon ? (
        <S.Icon mode={props.mode} {...icon} disabled={disabled} iconColor={iconColor || props.iconColor} />
      ) : null}
    </S.ButtonContainer>
  );
});
