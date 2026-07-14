import * as React from 'react';
import { getDarkenedColor } from '@journeyapps-labs/lib-reactor-utils';
import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import { TreeBadgeWidget } from './TreeBadgeWidget';
import { getTreeEntityMetadataColor, getTreeEntityMetadataKey } from './TreeEntityDetailsModel';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface TreeEntityDetailsBadgesWidgetProps {
  tags: string[];
  metadata: MetadataWidgetProps[];
  hiddenTagCount: number;
  onShowOverflowMenu: (event: React.MouseEvent) => void;
}

export const TreeEntityDetailsBadgesWidget: React.FC<TreeEntityDetailsBadgesWidgetProps> = (props) => {
  const currentTheme = useTheme(theme);

  return (
    <>
      {props.tags.map((tag) => (
        <TreeBadgeWidget
          key={tag}
          value={tag.charAt(0).toUpperCase()}
          background={currentTheme.cards.tagBackground}
          iconColor={currentTheme.cards.tagLabelForeground}
          tooltip={tag}
        />
      ))}
      {props.hiddenTagCount > 0 ? (
        <TreeBadgeWidget
          value={`+${props.hiddenTagCount}`}
          background={currentTheme.cards.tagBackground}
          action={props.onShowOverflowMenu}
        />
      ) : null}
      {props.metadata.map((item) => {
        const color = getTreeEntityMetadataColor(item, currentTheme);
        return (
          <TreeBadgeWidget
            key={getTreeEntityMetadataKey(item)}
            icon={item.icon?.name || 'list'}
            background={color}
            iconColor={getDarkenedColor(color, 0.7)}
            tooltip={`${item.label}: ${item.value}`}
          />
        );
      })}
    </>
  );
};
