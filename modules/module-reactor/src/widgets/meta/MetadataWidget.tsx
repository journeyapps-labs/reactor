import * as React from 'react';
import { MouseEventHandler } from 'react';
import { IconWidget } from '../icons/IconWidget';
import { getColorWithAlphaOptions } from '@journeyapps-labs/lib-reactor-utils';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { setupTooltipProps, TooltipPosition } from '../info/tooltips';
import type { EntityLabel } from '../../entities/components/meta/EntityDescriberComponent';

export interface MetadataWidgetProps extends EntityLabel {
  className?: any;
  onClick?: MouseEventHandler<any>;
}

namespace S {
  export const MetaEntry = styled.div<{ active: boolean; background: string; foreground: string; $cursor?: string }>`
    display: flex;
    align-items: center;
    font-size: 12px;
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
    border-radius: 3px;
    padding: 2px 10px;

    &:hover {
      opacity: 1;
    }
  `;

  export const MetaKey = styled.div<{ active: boolean }>`
    opacity: ${(p) => (p.active ? 1.0 : 0.5)};
    font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
    padding-right: 5px;
    white-space: nowrap;
  `;

  export const MetaValue = styled.div`
    white-space: nowrap;
  `;

  export const MetaIcon = styled(IconWidget)<{ color: string }>`
    color: ${(p) => p.color || p.theme.meta.foreground};
    font-weight: bold;
    margin-left: 5px;
  `;
}

export const MetadataWidget: React.FC<MetadataWidgetProps> = (props) => {
  return (
    <S.MetaEntry
      active={props.active}
      $cursor={props.onClick ? 'pointer' : null}
      background={props.color}
      foreground={props.colorForeground}
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
      <S.MetaKey active={props.active}>{props.label}</S.MetaKey>
      <S.MetaValue>{props.value}</S.MetaValue>
      {props.icon ? <S.MetaIcon spin={props.icon.spin} icon={props.icon.name} color={props.icon.color} /> : null}
    </S.MetaEntry>
  );
};
