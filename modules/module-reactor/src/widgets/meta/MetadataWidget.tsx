import * as React from 'react';
import { MouseEventHandler } from 'react';
import { IconWidget } from '../icons/IconWidget';
import { getColorWithAlphaOptions } from '@journeyapps-labs/lib-reactor-utils';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { ReactorTooltipWidget, setupTooltipProps, TooltipPosition } from '../info/tooltips';
import type { EntityLabel } from '../../entities/components/meta/EntityDescriberComponent';
import { getReactorBorderRadius, Size, useReactorSize } from '../../hooks/useReactorSize';

export interface MetadataWidgetProps extends EntityLabel {
  className?: any;
  onClick?: MouseEventHandler<any>;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: Size;
}

namespace S {
  export const MetaEntry = styled.div<{
    active: boolean;
    background: string;
    foreground: string;
    $cursor?: string;
    $size: Size;
  }>`
    display: flex;
    align-items: center;
    font-size: ${(p) => (p.$size === Size.SMALL ? '12px' : p.$size === Size.LARGE ? '14px' : '13px')};
    color: ${(p) => p.foreground || p.theme.meta.foreground};
    opacity: ${(p) => (p.active ? 1.0 : 0.6)};
    cursor: ${(p) => p.$cursor ?? 'auto'};
    background: ${(p) =>
      p.background
        ? getColorWithAlphaOptions({
            color: p.background,
            alphaValueIfNotPresent: 0.2
          })
        : p.theme.meta.background};
    border-radius: ${(p) => getReactorBorderRadius(p.$size)}px;
    padding: ${(p) => (p.$size === Size.SMALL ? '2px 10px' : p.$size === Size.LARGE ? '5px 14px' : '3px 12px')};

    &:hover {
      opacity: 1;
    }
  `;

  export const MetaKey = styled.div<{ active: boolean; $size: Size }>`
    opacity: ${(p) => (p.active ? 1.0 : 0.5)};
    font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
    padding-right: ${(p) => (p.$size === Size.LARGE ? '7px' : '5px')};
    white-space: nowrap;
  `;

  export const MetaValue = styled.div`
    white-space: nowrap;
  `;

  export const MetaIcon = styled(IconWidget)<{ color: string; $size: Size }>`
    color: ${(p) => p.color || p.theme.meta.foreground};
    font-weight: bold;
    margin-left: ${(p) => (p.$size === Size.LARGE ? '7px' : '5px')};
  `;
}

export const MetadataWidget: React.FC<MetadataWidgetProps> = (props) => {
  const isActive = props.active ?? true;
  const size = useReactorSize(props.size);

  return (
    <ReactorTooltipWidget tooltip={props.tooltip} tooltipPos={TooltipPosition.BOTTOM}>
      <S.MetaEntry
        active={isActive}
        $cursor={props.onClick ? 'pointer' : null}
        background={props.color}
        foreground={props.colorForeground}
        $size={size}
        className={props.className}
        {...setupTooltipProps({ tooltip: props.tooltip, tooltipPos: TooltipPosition.BOTTOM })}
        onClick={
          props.onClick
            ? (event) => {
                event.persist();
                return props.onClick(event);
              }
            : null
        }
      >
        {(props.showLabel ?? true) ? (
          <S.MetaKey active={isActive} $size={size}>
            {props.label}
          </S.MetaKey>
        ) : null}
        <S.MetaValue>{props.value}</S.MetaValue>
        {props.icon ? (
          <S.MetaIcon $size={size} spin={props.icon.spin} icon={props.icon.name} color={props.icon.color} />
        ) : null}
      </S.MetaEntry>
    </ReactorTooltipWidget>
  );
};
