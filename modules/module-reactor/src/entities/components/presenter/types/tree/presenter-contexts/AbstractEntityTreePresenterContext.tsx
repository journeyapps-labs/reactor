import React from 'react';
import _ from 'lodash';
import { CoreTreeWidget, ReactorTreeEntity, ReactorTreeNode } from '../../../../../../widgets';
import {
  AbstractPresenterContext,
  PresenterContextListener,
  RenderCollectionOptions
} from '../../../AbstractPresenterContext';
import { EntityTreeCollectionWidget } from '../EntityTreeCollectionWidget';
import {
  EntityTreePresenterComponent,
  EntityTreePresenterSetting,
  EntityTreePresenterSettings,
  EntityTreePresenterState,
  SortDirection
} from '../EntityTreePresenterComponent';
import { SelectEntityListener } from '../../../EntityPresenterComponent';
import { BatchStore } from '../../../../../../stores/batch/BatchStore';
import { inject } from '../../../../../../inversify.config';
import { ActionSource } from '../../../../../../actions';
import { System } from '../../../../../../core/System';
import { SetControl } from '../../../../../../controls/SetControl';
import { TreeNode } from '@journeyapps-labs/common-tree';
import { EntityReactorNode } from '../EntityReactorNode';
import { BaseObserverInterface } from '@journeyapps-labs/common-utils';
import { AbstractDescendentContextOptions } from '../descendent/AbstractDescendentContext';
import { LazyDescendentContext } from '../descendent/LazyDescendentContext';
import { ImmediateDescendentContext } from '../descendent/ImmediateDescendentContext';

export interface GenerateTreeOptions<T> {
  events?: BaseObserverInterface<SelectEntityListener<T>>;
  disableCache?: boolean;
}

export interface TreePresenterGenerationEvent<T> {
  entity: T;
  tree: ReactorTreeEntity;
}

export interface AbstractTreePresenterContextListener<T extends any = any> extends PresenterContextListener {
  treeGenerated?: (event: TreePresenterGenerationEvent<T>) => any;
}

export abstract class AbstractEntityTreePresenterContext<
  T extends any = any,
  Settings extends EntityTreePresenterSettings = EntityTreePresenterSettings
> extends AbstractPresenterContext<T, EntityTreePresenterState, Settings, AbstractTreePresenterContextListener<T>> {
  @inject(BatchStore)
  accessor batchStore: BatchStore;

  @inject(System)
  accessor system: System;

  nodeCache: Set<TreeNode>;
  rootContext: AbstractEntityTreePresenterContext;

  constructor(public presenter: EntityTreePresenterComponent<T>) {
    super(presenter);
    this.state = { trees: {} };
    this.rootContext = null;
    this.nodeCache = new Set();
    this.addSetting({
      icon: 'sort',
      label: 'Sort',
      key: EntityTreePresenterSetting.SORT,
      control: new SetControl<SortDirection>({
        initialValue: SortDirection.ASC,
        options: [
          {
            key: SortDirection.ASC,
            icon: 'sort-alpha-asc',
            label: 'Sort Asc'
          },
          {
            key: SortDirection.DESC,
            icon: 'sort-alpha-desc',
            label: 'Sort Desc'
          }
        ]
      })
    });
  }

  generateDescendentContext(options: AbstractDescendentContextOptions<T>) {
    if (options.presenter.loadChildrenAsNodesAreOpened) {
      return new LazyDescendentContext(options);
    }
    return new ImmediateDescendentContext(options);
  }

  saveState() {
    this.setState({
      trees: {
        open: _.flatMap(Array.from(this.nodeCache.values()).map((n) => n.serialize().open))
      }
    });
  }

  setRootContext(rootContext: AbstractEntityTreePresenterContext) {
    this.rootContext = rootContext;
  }

  get definition() {
    return this.presenter.definition;
  }

  getSortedEntities(entities: T[]) {
    const controlValues = this.getControlValues();
    if (controlValues[EntityTreePresenterSetting.SORT] === SortDirection.ASC) {
      entities = _.sortBy(entities, (e) => this.definition.describeEntity(e).simpleName?.toLowerCase());
    }
    if (controlValues[EntityTreePresenterSetting.SORT] === SortDirection.DESC) {
      entities = _.sortBy(entities, (e) => this.definition.describeEntity(e).simpleName?.toLowerCase()).reverse();
    }
    return entities;
  }

  getRootContext() {
    return this.rootContext || this;
  }

  getTreeNodes(event: RenderCollectionOptions<T>): ReactorTreeEntity[] {
    let entities = this.getSortedEntities(event.entities);

    // convert entities into nodes
    const nodes = this.doGetTreeNodes({
      ...event,
      entities: entities
    });

    nodes.forEach((n) => {
      if (n instanceof ReactorTreeNode) {
        n.deserialize(this.getRootContext().state.trees);
      }
      if (n instanceof EntityReactorNode) {
        n.setRootPresenterContext(this.getRootContext());
      }
    });

    // if we are actually the root
    if (!this.rootContext) {
      this.nodeCache.clear();
      nodes.forEach((n) => {
        if (n instanceof TreeNode) {
          this.nodeCache.add(n);
        }
      });
    }

    return nodes;
  }

  protected abstract doGetTreeNodes(event: RenderCollectionOptions<T>): ReactorTreeEntity[];

  protected abstract doGenerateTreeNode(entity: T, options?: GenerateTreeOptions<T>): ReactorTreeEntity;

  generateTreeNode(entity: T, options?: GenerateTreeOptions<T>): ReactorTreeEntity {
    let node = this.doGenerateTreeNode(entity, options);
    node.addPropGenerator(() => {
      const described = this.definition.describeEntity(entity);
      return {
        icon: described.icon,
        iconColor: described.iconColor,
        label: described.simpleName,
        label2: described.complexName
      };
    });
    this.patchTreeInteractions(node, entity);
    return node;
  }

  protected patchTreeInteractions(tree: ReactorTreeEntity, entity: T) {
    tree.addPropGenerator(() => {
      let encoded = this.definition.encode(entity, false);
      return {
        selected: this.batchStore.isSelected(encoded)
      };
    });

    tree.registerListener({
      action: (event) => {
        let encoded = this.definition.encode(entity, false);
        if (encoded && this.definition.isMultiSelectable()) {
          if (event.shiftKey) {
            return this.batchStore.select(encoded);
          }
          this.batchStore.selectOne(encoded);
        }
        this.definition.selectEntity({
          entity: entity,
          position: event,
          source: ActionSource.TREE_LEAF
        });
      },
      contextAction: (event) => {
        if (this.batchStore.selections.length > 1) {
          this.batchStore.showContextMenu(event);
          return;
        }
        this.definition.showContextMenuForEntity(entity, event);
      }
    });
  }

  renderCollection(event: RenderCollectionOptions<T>): React.JSX.Element {
    return <EntityTreeCollectionWidget event={event} presenterContext={this} />;
  }

  render(entity: T): React.JSX.Element {
    let node = this.generateTreeNode(entity);

    if (!node) {
      return null;
    }
    return <CoreTreeWidget tree={node}></CoreTreeWidget>;
  }
}
