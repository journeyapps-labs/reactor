import { CoreTreeWidgetProps, ReactorTreeEntity, ReactorTreeNode } from '../../../../../widgets';
import * as React from 'react';
import { EntityDefinition } from '../../../../EntityDefinition';
import { ReactorEntityDnDWrapper } from './widgets/ReactorEntityDnDWrapperWidget';
import { SelectEntityListener } from '../../EntityPresenterComponent';
import { BaseObserverInterface } from '@journeyapps-labs/lib-reactor-utils';
import { ReactorEntityWrapperWidget } from './widgets/ReactorEntityWrapperWidget';
import { DescendantEntityProviderComponent } from '../../../exposer/DescendantEntityProviderComponent';
import { AbstractEntityTreePresenterContext } from './presenter-contexts/AbstractEntityTreePresenterContext';
import { autorun, IReactionDisposer } from 'mobx';
import { EntityTreePresenterComponent } from './EntityTreePresenterComponent';
import { System } from '../../../../../core/System';
import { inject } from '../../../../../inversify.config';
import { TreeNode } from '@journeyapps-labs/lib-reactor-tree';

export class DescendentContext<E> {
  nodes: Set<ReactorTreeEntity>;
  disposer1: IReactionDisposer;
  disposer2: () => any;
  context: AbstractEntityTreePresenterContext;

  constructor(
    protected presenter: EntityTreePresenterComponent<any>,
    protected rootContext: AbstractEntityTreePresenterContext<any>,
    protected descendant: DescendantEntityProviderComponent<E, any>,
    protected node: EntityReactorNode<E>
  ) {
    this.nodes = new Set();
    this.context = presenter.generateContext();
    this.context.setRootContext(rootContext);
    this.disposer1 = autorun(
      () => {
        this.clear();
        const { options, entities } = descendant.getReactorTreeEntities(node.entity, this.context);
        this.disposer2 = descendant.installParentNode(node, options);
        entities.forEach((e) => {
          this.nodes.add(e);
          node.addChild(e);
          if (e instanceof TreeNode) {
            e.deserialize(node.context.state.trees);
          }
        });
      },
      { name: `descendent-context:${presenter.definition.type}` }
    );
  }

  clear() {
    this.disposer2?.();
    this.nodes.forEach((n) => {
      n.delete();
    });
    this.nodes.clear();
  }

  dispose() {
    this.clear();
    this.context.dispose();
    this.disposer1?.();
  }
}

export interface EntityReactorNodeOptions<E extends any = any> {
  definition: EntityDefinition;
  entity: E;
  events?: BaseObserverInterface<SelectEntityListener<E>>;
}

export class EntityReactorNode<E extends any = any> extends ReactorTreeNode {
  @inject(System)
  accessor system: System;

  descendants: Set<DescendentContext<E>>;
  context: AbstractEntityTreePresenterContext;

  constructor(protected options2: EntityReactorNodeOptions<E>) {
    super({
      key: options2.definition.getEntityUID(options2.entity),
      match: (event) => {
        return event.matches(options2.definition.describeEntity(options2.entity).simpleName);
      }
    });
    this.descendants = new Set();
    this.registerListener({
      attachedChanged: () => {
        if (this.attached && this.context) {
          this.attachDescendents();
        } else {
          this.disposeDescendents();
        }
      }
    });
  }

  disposeDescendents() {
    this.descendants.forEach((d) => {
      d.dispose();
    });
    this.descendants.clear();
  }

  attachDescendents() {
    this.options2.definition.getExposers().forEach((e) => {
      const presenter = this.system
        .getDefinition(e.descendantType)
        .getPresenters()
        .find((p) => p instanceof EntityTreePresenterComponent) as EntityTreePresenterComponent<any>;
      if (!presenter) {
        return;
      }
      this.descendants.add(new DescendentContext(presenter, this.context, e, this));
    });
    this.deserialize(this.context.state.trees);
  }

  setRootPresenterContext(context: AbstractEntityTreePresenterContext) {
    this.context = context;
    if (this.attached && this.descendants.size === 0) {
      this.attachDescendents();
    }
  }

  get entity() {
    return this.options2.entity;
  }

  renderWidget(event: CoreTreeWidgetProps): React.JSX.Element {
    return (
      <ReactorEntityDnDWrapper definition={this.options2.definition} node={this} entity={this.options2.entity}>
        {(ref) => {
          return (
            <ReactorEntityWrapperWidget forwardRef={ref} node={this} options={this.options2}>
              {super.renderWidget({
                ...event,
                forwardRef: ref
              })}
            </ReactorEntityWrapperWidget>
          );
        }}
      </ReactorEntityDnDWrapper>
    );
  }
}
