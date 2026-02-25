import { EntityTreePresenterComponent, EntityTreePresenterComponentOptions } from './EntityTreePresenterComponent';
import { TreeLeafWidgetProps } from '../../../../../widgets/tree/TreeLeafWidget';
import { TreeWidgetProps } from '../../../../../widgets/tree/TreeWidget';
import { ReactorTreeEntity } from '../../../../../widgets/core-tree/reactor-tree/reactor-tree-utils';
import { ReactorTreeLeaf } from '../../../../../widgets/core-tree/reactor-tree/ReactorTreeLeaf';
import { ReactorTreeNode } from '../../../../../widgets/core-tree/reactor-tree/ReactorTreeNode';
import { EntityTreePresenterContext } from './presenter-contexts/EntityTreePresenterContext';
import {
  AbstractEntityTreePresenterContext,
  GenerateTreeOptions
} from './presenter-contexts/AbstractEntityTreePresenterContext';
import { EntityReactorNode } from './EntityReactorNode';
import { EntityReactorLeaf } from './EntityReactorLeaf';
import { CachedEntityTreePresenterContext } from './presenter-contexts/CachedEntityTreePresenterContext';

export interface BaseInlineTreePresenterComponentOptions<T> extends EntityTreePresenterComponentOptions {
  augmentTreeProps?: (entity: T, hover: boolean) => Partial<TreeLeafWidgetProps>;
  augmentTreeNodeProps?: (entity: T, hover: boolean) => Partial<TreeWidgetProps>;
}

export interface InlineTreePresenterComponentOptions<T> extends BaseInlineTreePresenterComponentOptions<T> {
  /**
   * If true, will use the `CachedEntityTreePresenterContext` behind the scenes
   */
  cacheTreeEntities?: boolean;
}

export const patch_doGenerateTreeNode = (
  context: AbstractEntityTreePresenterContext,
  entity: any,
  events
): ReactorTreeNode | ReactorTreeLeaf => {
  if (context.definition.getExposers().length > 0) {
    return new EntityReactorNode({
      entity: entity,
      definition: context.definition,
      events: events?.events
    });
  }
  return new EntityReactorLeaf({
    entity: entity,
    definition: context.definition,
    events: events?.events
  });
};

export const patch_generateTreeNode = (
  options: InlineTreePresenterComponentOptions<any>,
  treeEntity: ReactorTreeEntity,
  entity: any
): ReactorTreeNode | ReactorTreeLeaf => {
  if (treeEntity instanceof ReactorTreeLeaf && options.augmentTreeProps) {
    treeEntity.addPropGenerator((props, depth, hover) => {
      return options.augmentTreeProps(entity, hover) || {};
    });
  } else if (treeEntity instanceof ReactorTreeNode && options.augmentTreeNodeProps) {
    treeEntity.addPropGenerator((props, depth, hover) => {
      return options.augmentTreeNodeProps(entity, hover) || {};
    });
  }
  return treeEntity;
};

export class InlineTreePresenterContext<T> extends EntityTreePresenterContext<T> {
  constructor(
    public presenter: InlineTreePresenterComponent<T>,
    protected options3: BaseInlineTreePresenterComponentOptions<T> = {}
  ) {
    super(presenter);
  }

  doGenerateTreeNode(entity: T, events): ReactorTreeNode | ReactorTreeLeaf {
    return patch_doGenerateTreeNode(this, entity, events);
  }

  generateTreeNode(entity: T, options?: GenerateTreeOptions<T>): ReactorTreeNode | ReactorTreeLeaf {
    const treeEntity = super.generateTreeNode(entity, options);
    return patch_generateTreeNode(this.options3, treeEntity, entity);
  }
}

export class InlineCachedTreePresenterContext<T> extends CachedEntityTreePresenterContext<T> {
  constructor(
    public presenter: InlineTreePresenterComponent<T>,
    protected options3: BaseInlineTreePresenterComponentOptions<T> = {}
  ) {
    super(presenter);
  }

  doGenerateTreeNode(entity: T, events): ReactorTreeNode | ReactorTreeLeaf {
    return patch_doGenerateTreeNode(this, entity, events);
  }

  generateTreeNode(entity: T, options?: GenerateTreeOptions<T>): ReactorTreeNode | ReactorTreeLeaf {
    const treeEntity = super.generateTreeNode(entity, options);
    return patch_generateTreeNode(this.options3, treeEntity, entity);
  }
}

export class InlineTreePresenterComponent<T> extends EntityTreePresenterComponent<T> {
  // Store options3 for context generation
  constructor(protected options3: InlineTreePresenterComponentOptions<T> = {}) {
    super(options3);
  }

  protected _generateContext(): AbstractEntityTreePresenterContext<T> {
    if (this.options3.cacheTreeEntities) {
      return new InlineCachedTreePresenterContext<T>(this, this.options3);
    }
    return new InlineTreePresenterContext<T>(this, this.options3);
  }
}
