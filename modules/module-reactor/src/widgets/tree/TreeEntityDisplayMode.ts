export enum TagDisplayMode {
  BADGE = 'badge',
  PILL = 'pill',
  NONE = 'none'
}

export enum MetadataDisplayMode {
  BADGE = 'badge',
  PILL = 'pill',
  NONE = 'none'
}

export interface MetadataDisplayOption {
  mode: MetadataDisplayMode;
  icon?: boolean;
  label?: boolean;
}

export type MetadataDisplayOptions = Record<string, MetadataDisplayOption>;

export const DEFAULT_METADATA_DISPLAY_OPTION = '_default';
