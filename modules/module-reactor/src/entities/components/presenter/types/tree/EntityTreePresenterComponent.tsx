import { TreeSerialized, TreeSerializedV2 } from '@journeyapps-labs/common-tree';
import {
  EntityPresenterComponent,
  EntityPresenterComponentOptions,
  EntityPresenterComponentRenderType
} from '../../EntityPresenterComponent';
import { inject } from '../../../../../inversify.config';
import { BatchStore } from '../../../../../stores/batch/BatchStore';
import { AbstractEntityTreePresenterContext } from './presenter-contexts/AbstractEntityTreePresenterContext';
import { SearchableTreeSearchScope } from '../../../../../widgets/core-tree/SearchableTreeSearchScope';

export enum EntityTreePresenterSetting {
  SORT = 'sort',
  GROUP_BY = 'groupBy'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum EntityTreeGroupingSetting {
  NONE = 'none',
  COMPLEX_NAME = 'complexName',
  TAGS = 'tags'
}

export interface EntityTreeAllowedGroupingSettings {
  complexName?: boolean;
  tags?: boolean;
}

export interface EntityTreePresenterSettings {
  [EntityTreePresenterSetting.SORT]: SortDirection;
  [EntityTreePresenterSetting.GROUP_BY]?: EntityTreeGroupingSetting;
}

export interface EntityTreePresenterState {
  trees: TreeSerialized | TreeSerializedV2;
}

export interface EntityTreePresenterComponentOptions<T = any> extends Omit<EntityPresenterComponentOptions, 'label'> {
  loadChildrenAsNodesAreOpened?: boolean;
  searchScope?: SearchableTreeSearchScope;
  label?: string;
  allowedGroupingSettings?: EntityTreeAllowedGroupingSettings;
  defaultGroupingSetting?: EntityTreeGroupingSetting;
}

export abstract class EntityTreePresenterComponent<T> extends EntityPresenterComponent<
  T,
  AbstractEntityTreePresenterContext<T>
> {
  static DEFAULT_LABEL = 'Tree view';

  @inject(BatchStore)
  accessor batchStore: BatchStore;

  constructor(public readonly options2: EntityTreePresenterComponentOptions<T> = {}) {
    super(EntityPresenterComponentRenderType.TREE, {
      ...options2,
      label: options2.label || EntityTreePresenterComponent.DEFAULT_LABEL
    });
  }

  get loadChildrenAsNodesAreOpened() {
    return this.options2.loadChildrenAsNodesAreOpened;
  }

  get searchScope() {
    return this.options2.searchScope || SearchableTreeSearchScope.FULL_TREE;
  }
}
