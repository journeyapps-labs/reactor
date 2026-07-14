import * as React from 'react';
import styled from '@emotion/styled';
import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import { PillWidget } from '../status/PillWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { getTreeEntityMetadataKey } from './TreeEntityDetailsModel';

export interface TreeEntityDetailsPillsWidgetProps {
  tags: string[];
  metadata: MetadataWidgetProps[];
  hiddenTagCount: number;
  onShowOverflowMenu: (event: React.MouseEvent) => void;
}

namespace S {
  export const Tag = themed(PillWidget)`
    background: ${(p) => p.theme.cards.tagBackground};
  `;

  export const MetadataPill = themed(PillWidget)`
    background: ${(p) => p.theme.meta.background};
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
    {props.metadata.map((item) => (
      <S.MetadataPill
        key={getTreeEntityMetadataKey(item)}
        label={item.label}
        meta={{ label: item.value, icon: item.icon?.name }}
      />
    ))}
  </>
);
