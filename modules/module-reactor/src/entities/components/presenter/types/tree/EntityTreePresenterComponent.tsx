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
  SORT = 'sort'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface EntityTreePresenterSettings {
  [EntityTreePresenterSetting.SORT]: SortDirection;
}

export interface EntityTreePresenterState {
  trees: TreeSerialized | TreeSerializedV2;
}

export interface EntityTreePresenterComponentOptions extends Omit<EntityPresenterComponentOptions, 'label'> {
  loadChildrenAsNodesAreOpened?: boolean;
  searchScope?: SearchableTreeSearchScope;
  label?: string;
}

export abstract class EntityTreePresenterComponent<T> extends EntityPresenterComponent<
  T,
  AbstractEntityTreePresenterContext<T>
> {
  static DEFAULT_LABEL = 'Tree view';

  @inject(BatchStore)
  accessor batchStore: BatchStore;

  constructor(protected options2: EntityTreePresenterComponentOptions) {
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
