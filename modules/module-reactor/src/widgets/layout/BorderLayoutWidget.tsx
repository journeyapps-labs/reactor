import * as React from 'react';
import styled from '@emotion/styled';

export interface BorderLayoutWidgetProps {
  className?: any;
  top?: React.JSX.Element;
  bottom?: React.JSX.Element;
}

export const BorderLayoutWidget: React.FC<React.PropsWithChildren<BorderLayoutWidgetProps>> = (props) => {
  return (
    <S.Container className={props.className}>
      {props.top ? <S.BorderWidget>{props.top}</S.BorderWidget> : null}
      <S.Center>{props.children}</S.Center>
      {props.bottom ? <S.BorderWidget>{props.bottom}</S.BorderWidget> : null}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `;

  export const Center = styled.div`
    flex-grow: 1;
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  `;

  export const BorderWidget = styled.div`
    flex-shrink: 0;
    flex-grow: 0;
  `;
}
