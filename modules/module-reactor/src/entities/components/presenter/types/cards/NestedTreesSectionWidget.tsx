import React from 'react';
import styled from '@emotion/styled';
import { themed } from '../../../../../stores/themes/reactor-theme-fragment';
import { NestedTreeRenderOption } from './EntityCardsPresenterComponent';

export interface NestedTreesSectionWidgetProps {
  nestedTrees: NestedTreeRenderOption[];
}

namespace S {
  export const NestedSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

  export const NestedHeader = themed.div`
    font-size: 12px;
    color: ${(p) => p.theme.cards.foreground};
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  `;
}

export function NestedTreesSectionWidget(props: NestedTreesSectionWidgetProps) {
  if (props.nestedTrees.length === 0) {
    return null;
  }

  return (
    <>
      {props.nestedTrees.map((nested: NestedTreeRenderOption) => {
        return (
          <S.NestedSection key={nested.key}>
            <S.NestedHeader>{nested.label}</S.NestedHeader>
            {nested.context.renderCollection({
              entities: nested.entities
            })}
          </S.NestedSection>
        );
      })}
    </>
  );
}
