import * as React from 'react';
import styled from '@emotion/styled';
import { PillWidget } from '../status/PillWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TreeEntityDetailsPillsWidgetProps {
  tags: string[];
  hiddenTagCount: number;
  onShowOverflowMenu: (event: React.MouseEvent) => void;
}

namespace S {
  export const Tag = themed(PillWidget)`
    background: ${(p) => p.theme.cards.tagBackground};
  `;
}

export const TreeEntityDetailsPillsWidget: React.FC<TreeEntityDetailsPillsWidgetProps> = (props) => (
  <>
    {props.tags.map((tag) => (
      <S.Tag key={tag} label={tag} />
    ))}
    {props.hiddenTagCount > 0 ? (
      <PillWidget label={`+${props.hiddenTagCount}`} action={props.onShowOverflowMenu} tooltip="Show all tags" />
    ) : null}
  </>
);
