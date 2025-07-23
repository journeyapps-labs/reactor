import * as React from 'react';
import { ReactorIcon, IconWidget } from './IconWidget';
import { styled } from '../../stores/themes/reactor-theme-fragment';

export interface DualIconWidgetProps {
  icon1: ReactorIcon;
  icon2: ReactorIcon;
  color1?: string;
  color2?: string;
  className?: any;
}

namespace S {
  export const Container = styled.div<{ color: string }>`
    position: relative;
    padding-right: 5px;
    padding-bottom: 3px;
    box-sizing: border-box;
    min-width: 20px;
    color: ${(p) => p.color || p.theme.icons.color};
  `;

  const ACCENT = `14px`;

  export const Accent = styled.div<{ color: string }>`
    position: absolute;
    bottom: 0;
    right: 0;
    background: ${(p) => p.theme.icons.dualIconBackground};
    color: ${(p) => p.color || `rgb(0,192,255)`};
    font-size: 9px;
    border-radius: 4px;
    width: ${ACCENT};
    height: ${ACCENT};
    line-height: ${ACCENT};
    vertical-align: middle;
    text-align: center;
  `;

  export const AccentIcon = styled(IconWidget)`
    margin-left: -0.3px;
    margin-bottom: -0.3px;
  `;
}

export const DualIconWidget: React.FC<DualIconWidgetProps> = React.memo((props) => {
  return (
    <S.Container color={props.color1} className={props.className}>
      <IconWidget icon={props.icon1} />
      <S.Accent color={props.color2}>
        <S.AccentIcon icon={props.icon2} />
      </S.Accent>
    </S.Container>
  );
});
