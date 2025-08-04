import { TreeSerialized } from '@journeyapps-labs/common-tree';
import {
  EntityPresenterComponent,
  EntityPresenterComponentOptions,
  EntityPresenterComponentRenderType
} from '../../EntityPresenterComponent';
import { inject } from '../../../../../inversify.config';
import { BatchStore } from '../../../../../stores/batch/BatchStore';
import { AbstractEntityTreePresenterContext } from './presenter-contexts/AbstractEntityTreePresenterContext';

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
  trees: TreeSerialized;
}

export abstract class EntityTreePresenterComponent<T> extends EntityPresenterComponent<
  T,
  AbstractEntityTreePresenterContext<T>
> {
  static DEFAULT_LABEL = 'Tree view';

  @inject(BatchStore)
  accessor batchStore: BatchStore;

  constructor(options: EntityPresenterComponentOptions = { label: EntityTreePresenterComponent.DEFAULT_LABEL }) {
    super(EntityPresenterComponentRenderType.TREE, options);
  }
}
