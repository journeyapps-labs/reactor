import React from 'react';
import styled from '@emotion/styled';
import { themed } from '../../../../../stores/themes/reactor-theme-fragment';
import { PillWidget } from '../../../../../widgets/status/PillWidget';

export interface TagsSectionWidgetProps {
  tags: string[];
  theme: any;
}

namespace S {
  export const PillRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  `;

  export const TagPill = themed(PillWidget)`
    background: ${(p) => p.theme.cards.tagBackground};
  `;
}

export function TagsSectionWidget(props: TagsSectionWidgetProps) {
  return (
    <S.PillRow>
      {props.tags.map((tag) => (
        <S.TagPill
          key={`tag-${tag}`}
          label={tag}
          color={props.theme.cards.tagBackground}
          labelBackground={props.theme.cards.tagLabelBackground}
          labelColor={props.theme.cards.tagLabelForeground}
        />
      ))}
    </S.PillRow>
  );
}
