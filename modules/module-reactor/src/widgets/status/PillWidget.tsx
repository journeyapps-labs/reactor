import * as React from 'react';
import { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import { setupTooltipProps } from '../info/tooltips';

export interface PillWidgetProps {
  label: string;
  color?: string;
  labelBackground?: string;
  labelColor?: string;
  className?;
  action?: (event: React.MouseEvent) => any;
  rightClick?: (event: MouseEvent) => any;
  meta?: {
    label?: string;
    icon?: ReactorIcon;
  };
  tooltip?: string;
}

namespace S {
  const RADIUS = 3;

  export const Container = styled.div<{ color: string; $cursor: boolean }>`
    border-radius: ${RADIUS}px;
    background: ${(p) => p.color};
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: ${(p) => (p.$cursor ? 'pointer' : 'inherit')};
  `;

  export const Label = styled.div<{ hasIcon: boolean; background?: string; color?: string }>`
    background: ${(p) => p.background || 'rgba(0, 0, 0, 0.3)'};
    color: ${(p) => p.color || 'rgba(255, 255, 255, 0.8)'};
    border-top-right-radius: ${(p) => (p.hasIcon ? 0 : RADIUS)}px;
    border-bottom-right-radius: ${(p) => (p.hasIcon ? 0 : RADIUS)}px;
    padding: 2px 5px;
    white-space: nowrap;
    flex-shrink: 0;
  `;

  export const Meta = styled.div`
    padding-left: 5px;
    color: black;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    > * {
      padding-right: 5px;
    }
  `;

  export const MetaLabel = styled.div``;
}

export const PillWidget: React.FC<PillWidgetProps> = (props) => {
  return (
    <S.Container
      $cursor={!!props.action}
      onClick={(event) => {
        props.action?.(event);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.persist();
        props.rightClick?.(event);
      }}
      className={props.className}
      color={props.color || 'rgb(150,150,150)'}
      {...setupTooltipProps({ tooltip: props.tooltip })}
    >
      <S.Label hasIcon={!!props.meta} background={props.labelBackground} color={props.labelColor}>
        {props.label}
      </S.Label>
      {props.meta ? (
        <S.Meta>
          {props.meta.icon ? <IconWidget icon={props.meta.icon} /> : null}
          {props.meta.label ? <S.MetaLabel>{props.meta.label}</S.MetaLabel> : null}
        </S.Meta>
      ) : null}
    </S.Container>
  );
};
