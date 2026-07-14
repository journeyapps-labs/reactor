import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import { MetadataDisplayMode, TagDisplayMode } from './TreeEntityDisplayMode';
import type { GetTheme } from '../../stores/themes/ThemeFragment';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface TreeEntityDetailsDisplayModel {
  tags: string[];
  metadata: MetadataWidgetProps[];
  badgeTags: string[];
  pillTags: string[];
  badgeMetadata: MetadataWidgetProps[];
  pillMetadata: MetadataWidgetProps[];
  metaBarMetadata: MetadataWidgetProps[];
  badgeHiddenTagCount: number;
  pillHiddenTagCount: number;
}

export const createTreeEntityDetailsDisplayModel = (options: {
  tags?: string[];
  metadata?: MetadataWidgetProps[];
  tagDisplayMode?: TagDisplayMode;
  metadataDisplayMode?: MetadataDisplayMode;
  maxTags?: number;
}): TreeEntityDetailsDisplayModel => {
  const tags = options.tagDisplayMode === TagDisplayMode.NONE ? [] : options.tags || [];
  const metadata = options.metadataDisplayMode === MetadataDisplayMode.NONE ? [] : options.metadata || [];
  const visibleTags = tags.slice(0, options.maxTags ?? 3);
  const hiddenTagCount = tags.length - visibleTags.length;
  const tagsAreBadges = options.tagDisplayMode === TagDisplayMode.BADGE;
  const tagsArePills = options.tagDisplayMode === TagDisplayMode.PILL;

  return {
    tags,
    metadata,
    badgeTags: tagsAreBadges ? visibleTags : [],
    pillTags: tagsArePills ? visibleTags : [],
    badgeMetadata: options.metadataDisplayMode === MetadataDisplayMode.BADGE ? metadata : [],
    pillMetadata: options.metadataDisplayMode === MetadataDisplayMode.PILL ? metadata : [],
    metaBarMetadata: options.metadataDisplayMode === MetadataDisplayMode.METADATA ? metadata : [],
    badgeHiddenTagCount: tagsAreBadges ? hiddenTagCount : 0,
    pillHiddenTagCount: tagsArePills ? hiddenTagCount : 0
  };
};

export const getTreeEntityMetadataKey = (item: MetadataWidgetProps) => item.id || `${item.label}:${item.value}`;

export const getTreeEntityMetadataColor = (item: MetadataWidgetProps, currentTheme: GetTheme<typeof theme>) =>
  item.icon?.color || item.color || currentTheme.meta.background;
