import * as React from 'react';
import styled from '@emotion/styled';
import { MetaBarWidget } from '../meta/MetaBarWidget';
import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import { ReactorViewportMode, useReactorViewportMode } from '../../hooks/useReactorViewportMode';
import { TreeEntityDetailsContentWidget } from './TreeEntityDetailsContentWidget';
import { createTreeEntityDetailsDisplayModel } from './TreeEntityDetailsModel';
import { useTreeEntityDetailsOverflowMenu } from './useTreeEntityDetailsOverflowMenu';
import { MetadataDisplayMode, MetadataDisplayOptions, TagDisplayMode } from './TreeEntityDisplayMode';
import { OverflowCollapseWidget } from '../layout/OverflowCollapseWidget';
import { TreeBadgeWidget } from './TreeBadgeWidget';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface TreeEntityDetailsWidgetProps {
  tags?: string[];
  metadata?: MetadataWidgetProps[];
  tagDisplayMode?: TagDisplayMode;
  metadataDisplayOptions?: MetadataDisplayOptions;
  maxTags?: number;
}

namespace S {
  export const Content = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 5px;
    padding-right: 5px;
    margin-left: auto;
    min-width: 0;
    white-space: nowrap;
  `;
}

export const TreeEntityDetailsWidget: React.FC<TreeEntityDetailsWidgetProps> = (props) => {
  const viewportMode = useReactorViewportMode();
  const currentTheme = useTheme(theme);
  const mobile = viewportMode === ReactorViewportMode.MOBILE;
  const details = createTreeEntityDetailsDisplayModel({
    ...props,
    tagDisplayMode: mobile ? TagDisplayMode.BADGE : props.tagDisplayMode,
    metadataDisplayModeOverride: mobile ? MetadataDisplayMode.BADGE : undefined
  });
  const showOverflowMenu = useTreeEntityDetailsOverflowMenu(details);

  if (details.tags.length === 0 && details.metadata.length === 0) {
    return null;
  }

  return (
    <OverflowCollapseWidget
      alignLeft={false}
      fallback={
        <TreeBadgeWidget
          icon="tags"
          background={currentTheme.trees.overflowBackground}
          action={showOverflowMenu}
          tooltip="Show tags and metadata"
        />
      }
    >
      <S.Content>
        <TreeEntityDetailsContentWidget details={details} onShowOverflowMenu={showOverflowMenu} />
        <MetaBarWidget meta={details.metaBarMetadata} />
      </S.Content>
    </OverflowCollapseWidget>
  );
};
