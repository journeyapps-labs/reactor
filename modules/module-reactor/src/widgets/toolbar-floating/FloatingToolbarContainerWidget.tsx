import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';

export interface FloatingToolbarContainerWidgetProps {
  toolbars: React.JSX.Element[];
}

namespace S {
  export const Container = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
  `;

  export const Layer = styled.div`
    display: flex;
    position: absolute;
    top: 20px;
    left: 20px;
    flex-direction: column;
  `;

  export const Floating = styled.div`
    margin-bottom: 5px;
  `;
}

export class FloatingToolbarContainerWidget extends React.Component<
  React.PropsWithChildren<FloatingToolbarContainerWidgetProps>
> {
  render() {
    return (
      <S.Container>
        {this.props.children}
        <S.Layer>
          {_.map(this.props.toolbars, (toolbar) => {
            return <S.Floating key={toolbar.key}>{toolbar}</S.Floating>;
          })}
        </S.Layer>
      </S.Container>
    );
  }
}
