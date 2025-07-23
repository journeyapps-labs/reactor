import * as React from 'react';
import styled from '@emotion/styled';

export interface TreeContentWidgetProps {
  depth: number;
  className?;
}

namespace S {
  export const CenterContent = styled.div<{ leftSpacing: number }>`
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-left: ${(p) => p.leftSpacing}px;
  `;
}

export const TreeContentWidget: React.FC<React.PropsWithChildren<TreeContentWidgetProps>> = React.memo((props) => {
  return (
    <S.CenterContent className={props.className} leftSpacing={props.depth * 19 + 5}>
      {props.children}
    </S.CenterContent>
  );
});
