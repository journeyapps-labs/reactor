import * as React from 'react';
import { IconWidget, ReactorIcon } from '../icons/IconWidget';
import { ButtonAction } from '../../definitions/common';
import styled from '@emotion/styled';

namespace S {
  export const Symbol = styled.div<{ color?: string; foreground: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background: ${(p) => p.color || 'transparent'};
    color: ${(p) => p.foreground};
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
    --balloon-color: ${(p) => p.color};
  `;
}

export interface TreeBadgeWidgetProps {
  background?: string;
  iconColor?: string;
  tooltip?: string;
  icon: ReactorIcon;
  action?: ButtonAction;
}

export const TreeBadgeWidget: React.FC<TreeBadgeWidgetProps> = (props) => {
  const { background, iconColor, icon, tooltip, action } = props;
  return (
    <S.Symbol
      key={`${tooltip}-${icon}`}
      color={background}
      foreground={iconColor || '#fff'}
      aria-label={tooltip}
      data-balloon-pos={'left'}
      onClick={(event) => {
        event.stopPropagation();
        action?.(event);
      }}
    >
      <IconWidget icon={icon} />
    </S.Symbol>
  );
};
