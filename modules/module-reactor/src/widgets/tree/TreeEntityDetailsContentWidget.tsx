import * as React from 'react';
import styled from '@emotion/styled';
import type { TreeEntityDetailsDisplayModel } from './TreeEntityDetailsModel';
import { TreeEntityDetailsBadgesWidget } from './TreeEntityDetailsBadgesWidget';
import { TreeEntityDetailsPillsWidget } from './TreeEntityDetailsPillsWidget';

export interface TreeEntityDetailsContentWidgetProps {
  details: TreeEntityDetailsDisplayModel;
  overflowed?: boolean;
  onShowOverflowMenu: (event: React.MouseEvent) => void;
}

namespace S {
  export const Tags = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 2px;
  `;
}

export const TreeEntityDetailsContentWidget: React.FC<TreeEntityDetailsContentWidgetProps> = (props) => {
  if (props.overflowed) {
    return null;
  }

  return (
    <S.Tags>
      <TreeEntityDetailsBadgesWidget
        tags={props.details.badgeTags}
        metadata={props.details.badgeMetadata}
        hiddenTagCount={props.details.badgeHiddenTagCount}
        onShowOverflowMenu={props.onShowOverflowMenu}
      />
      <TreeEntityDetailsPillsWidget
        tags={props.details.pillTags}
        metadata={props.details.pillMetadata}
        hiddenTagCount={props.details.pillHiddenTagCount}
        onShowOverflowMenu={props.onShowOverflowMenu}
      />
    </S.Tags>
  );
};
