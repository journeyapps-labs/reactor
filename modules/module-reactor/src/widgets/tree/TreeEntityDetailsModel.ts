import type { MetadataWidgetProps } from '../meta/MetadataWidget';
import {
  DEFAULT_METADATA_DISPLAY_OPTION,
  MetadataDisplayMode,
  MetadataDisplayOptions,
  TagDisplayMode
} from './TreeEntityDisplayMode';
import type { GetTheme } from '../../stores/themes/ThemeFragment';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface TreeEntityDetailsDisplayModel {
  tags: string[];
  metadata: MetadataWidgetProps[];
  badgeTags: string[];
  pillTags: string[];
  badgeMetadata: MetadataWidgetProps[];
  metaBarMetadata: MetadataWidgetProps[];
  badgeHiddenTagCount: number;
  pillHiddenTagCount: number;
}

export const createTreeEntityDetailsDisplayModel = (options: {
  tags?: string[];
  metadata?: MetadataWidgetProps[];
  tagDisplayMode?: TagDisplayMode;
  metadataDisplayOptions?: MetadataDisplayOptions;
  metadataDisplayModeOverride?: MetadataDisplayMode;
  maxTags?: number;
}): TreeEntityDetailsDisplayModel => {
  const tags = options.tagDisplayMode === TagDisplayMode.NONE ? [] : options.tags || [];
  const metadataByMode = (options.metadata || []).reduce(
    (result, item) => {
      const displayOption =
        options.metadataDisplayOptions?.[item.label] ||
        options.metadataDisplayOptions?.[DEFAULT_METADATA_DISPLAY_OPTION];
      const mode = options.metadataDisplayModeOverride || displayOption?.mode || MetadataDisplayMode.NONE;
      if (mode === MetadataDisplayMode.NONE) {
        return result;
      }

      const configuredItem = {
        ...item,
        showIcon: displayOption?.icon ?? true,
        showLabel: displayOption?.label ?? true
      };
      result.metadata.push(configuredItem);
      if (mode === MetadataDisplayMode.BADGE) {
        result.badgeMetadata.push(configuredItem);
      } else if (mode === MetadataDisplayMode.PILL) {
        result.metaBarMetadata.push(configuredItem);
      }
      return result;
    },
    {
      metadata: [] as MetadataWidgetProps[],
      badgeMetadata: [] as MetadataWidgetProps[],
      metaBarMetadata: [] as MetadataWidgetProps[]
    }
  );
  const metadata = metadataByMode.metadata;
  const visibleTags = tags.slice(0, options.maxTags ?? 3);
  const hiddenTagCount = tags.length - visibleTags.length;
  const tagsAreBadges = options.tagDisplayMode === TagDisplayMode.BADGE;
  const tagsArePills = options.tagDisplayMode === TagDisplayMode.PILL;

  return {
    tags,
    metadata,
    badgeTags: tagsAreBadges ? visibleTags : [],
    pillTags: tagsArePills ? visibleTags : [],
    badgeMetadata: metadataByMode.badgeMetadata,
    metaBarMetadata: metadataByMode.metaBarMetadata,
    badgeHiddenTagCount: tagsAreBadges ? hiddenTagCount : 0,
    pillHiddenTagCount: tagsArePills ? hiddenTagCount : 0
  };
};

export const getTreeEntityMetadataKey = (item: MetadataWidgetProps) => item.id || `${item.label}:${item.value}`;

export const getTreeEntityMetadataColor = (item: MetadataWidgetProps, currentTheme: GetTheme<typeof theme>) =>
  item.icon?.color || item.color || currentTheme.meta.background;
