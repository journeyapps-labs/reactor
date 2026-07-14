import * as React from 'react';
import styled from '@emotion/styled';
import type { TreeEntityDetailsDisplayModel } from './TreeEntityDetailsModel';
import { TreeEntityDetailsBadgesWidget } from './TreeEntityDetailsBadgesWidget';
import { TreeEntityDetailsPillsWidget } from './TreeEntityDetailsPillsWidget';

export interface TreeEntityDetailsContentWidgetProps {
  details: TreeEntityDetailsDisplayModel;
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
        hiddenTagCount={props.details.pillHiddenTagCount}
        onShowOverflowMenu={props.onShowOverflowMenu}
      />
    </S.Tags>
  );
};
