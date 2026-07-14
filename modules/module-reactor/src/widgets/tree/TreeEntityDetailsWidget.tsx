import * as React from 'react';
import styled from '@emotion/styled';
import { MetaBarWidget } from '../meta/MetaBarWidget';
import { PillWidget } from '../status/PillWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import { ReactorViewportMode, useReactorViewportMode } from '../../hooks/useReactorViewportMode';
import { TreeEntityDetailsContentWidget } from './TreeEntityDetailsContentWidget';
import { createTreeEntityDetailsDisplayModel } from './TreeEntityDetailsModel';
import { useTreeEntityDetailsOverflowMenu } from './useTreeEntityDetailsOverflowMenu';
import { MetadataDisplayMode, TagDisplayMode } from './TreeEntityDisplayMode';

export interface TreeEntityDetailsWidgetProps {
  tags?: string[];
  metadata?: MetadataWidgetProps[];
  tagDisplayMode?: TagDisplayMode;
  metadataDisplayMode?: MetadataDisplayMode;
  overflowed?: boolean;
  maxTags?: number;
}

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 5px;
    padding-right: 5px;
    margin-left: auto;
    white-space: nowrap;
  `;

  export const OverflowPill = themed(PillWidget)`
    background: ${(p) => p.theme.trees.overflowBackground};
  `;
}

export const TreeEntityDetailsWidget: React.FC<TreeEntityDetailsWidgetProps> = (props) => {
  const viewportMode = useReactorViewportMode();
  const mobile = viewportMode === ReactorViewportMode.MOBILE;
  const details = createTreeEntityDetailsDisplayModel({
    ...props,
    tagDisplayMode: mobile ? TagDisplayMode.BADGE : props.tagDisplayMode,
    metadataDisplayMode: mobile ? MetadataDisplayMode.BADGE : props.metadataDisplayMode
  });
  const showOverflowMenu = useTreeEntityDetailsOverflowMenu(details);

  if (details.tags.length === 0 && details.metadata.length === 0) {
    return null;
  }

  return (
    <S.Container>
      <TreeEntityDetailsContentWidget
        details={details}
        overflowed={props.overflowed}
        onShowOverflowMenu={showOverflowMenu}
      />
      <MetaBarWidget
        meta={details.metaBarMetadata}
        showIcons
        overflow={{
          fallback: <S.OverflowPill label="…" action={showOverflowMenu} tooltip="Show tags and metadata" />,
          forceOverflow: props.overflowed,
          observe: false
        }}
      />
    </S.Container>
  );
};
