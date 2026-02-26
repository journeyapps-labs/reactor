import {
  TreeEntity,
  TreeNode,
  TreeNodeListener,
  TreeSerialized,
  TreeSerializedV2
} from '@journeyapps-labs/common-tree';
import { TreeWidget } from '../../tree/TreeWidget';
import * as _ from 'lodash';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { CoreTreeWidgetProps } from '../CoreTreeWidget';
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import { observer } from 'mobx-react';
import { PatchTree, ReactorTreeListener } from './PatchTree';
import { isBaseReactorTree, ReactorTreeEntity, ReactorTreeOptions, setupReactorTree } from './reactor-tree-utils';
import { SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { ReactorTreeLeaf } from './ReactorTreeLeaf';
import styled from '@emotion/styled';
import { SearchableTreeSearchScope } from '../SearchableTreeSearchScope';

export enum ReactorTreeNodeDefaultOpenPolicy {
  NEVER = 'never',
  FIRST_RENDER = 'first-render',
  ALWAYS = 'always'
}

export const useTreeEntity = (options: { tree: ReactorTreeEntity }) => {
  const { tree } = options;
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return tree.registerListener({
      propGeneratorsChanged: () => {
        forceUpdate({
          defer: true
        });
      }
    });
  }, [tree]);
  useEffect(() => {
    tree.setVisible(true);
    if (!tree.getParent()) {
      tree.setAttached(true);
    }
    return () => {
      tree.setVisible(false);
      if (!tree.getParent()) {
        tree.setAttached(false);
      }
    };
  }, [tree]);
};

const useTreeNode = (tree: TreeNode, updated: () => any) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const disposer = tree.registerListener({
      collapsedChanged: () => {
        forceUpdate({
          defer: true
        });
        updated?.();
      }
    });
    forceUpdate();
    return disposer;
  }, [tree, updated]);
};

const useChildren = (options: { tree: TreeNode; event: CoreTreeWidgetProps }) => {
  const { tree, event } = options;
  const forceUpdate = useForceUpdate();
  const [childrenHasMatches, setChildrenHasMatches] = useState(false);
  useLayoutEffect(() => {
    const disposer = tree.registerListener({
      childAdded: () => {
        forceUpdate({
          defer: true
        });
      },
      childRemoved: () => {
        forceUpdate({
          defer: true
        });
      }
    });
    forceUpdate();
    return disposer;
  }, [tree]);

  useEffect(() => {
    if (event.search && event.searchScope === SearchableTreeSearchScope.FULL_TREE) {
      tree.open();
    } else {
      setChildrenHasMatches(false);
    }
  }, [event.search, event.searchScope]);

  return {
    childrenHasMatches: event.search ? childrenHasMatches : true,
    childrenFunc: (depth) => {
      if (event.searchScope === SearchableTreeSearchScope.VISIBLE_ONLY && tree.collapsed) {
        return null;
      }

      return (
        <>
          {_.map(tree.children, (element) => {
            return (
              <UniversalNodeWidget
                key={element.getPathAsString()}
                tree={element}
                event={{
                  ...event,
                  hasMatchedChildren: (match) => {
                    if (match) {
                      setChildrenHasMatches(true);
                      event.hasMatchedChildren?.(true);
                    }
                  },
                  depth
                }}
              />
            );
          })}
        </>
      );
    }
  };
};

const BaseTreeNodeWidget: React.FC<{
  tree: TreeNode;
  event: CoreTreeWidgetProps;
}> = observer((props) => {
  const { event, tree } = props;
  useTreeNode(tree, event.events?.updated);
  const { childrenFunc, childrenHasMatches } = useChildren({ tree, event });

  if (childrenHasMatches) {
    return event.renderTreeNode({
      depth: event.depth,
      children: () => childrenFunc(event.depth + 1),
      entity: tree,
      props: null
    });
  }
  return <>{childrenFunc(event.depth + 1)}</>;
});

const ReactorTreeNodeWidget: React.FC<{
  tree: ReactorTreeNode;
  event: CoreTreeWidgetProps;
}> = observer(({ event, tree }) => {
  const forceUpdate = useForceUpdate();

  useTreeNode(tree, event.events?.updated);
  useTreeEntity({ tree });

  const { childrenFunc, childrenHasMatches } = useChildren({ tree, event });
  const [renderThis, setRenderThis] = useState(true);

  useEffect(() => {
    return tree.registerListener({
      sortChanged: () => {
        forceUpdate({
          defer: true
        });
      }
    });
  }, [tree]);

  useLayoutEffect(() => {
    let res = tree.setSearch(event.search);
    if (event.search) {
      setRenderThis(res);
      event.hasMatchedChildren?.(res);
    } else {
      setRenderThis(true);
    }
  }, [event.search]);

  const treeProps = tree.getProps(event);

  if (childrenHasMatches || renderThis) {
    return (
      <TreeWidget
        {...treeProps}
        forwardRef={event.forwardRef}
        depth={event.depth}
        collapsed={tree.collapsed}
        onCollapsedChanged={(collapsed, deep) => {
          treeProps.onCollapsedChanged?.(collapsed, deep);
          tree.setCollapsed(collapsed);
          if (deep) {
            tree.openChildren(!collapsed);
          }
        }}
      >
        {childrenFunc}
      </TreeWidget>
    );
  }
  return <>{childrenFunc(event.depth + 1)}</>;
});

export const UniversalNodeWidget: React.FC<{
  tree: ReactorTreeNode | ReactorTreeLeaf | TreeEntity;
  event: CoreTreeWidgetProps;
}> = observer((props) => {
  if (props.tree instanceof ReactorTreeNode) {
    return <ReactorTreeNodeWidget event={props.event} tree={props.tree} />;
  }
  if (props.tree instanceof TreeNode) {
    return <BaseTreeNodeWidget event={props.event} tree={props.tree} />;
  }
  if (props.tree instanceof ReactorTreeLeaf) {
    return props.tree.renderWidget(props.event);
  }
  return props.event.renderTreeLeaf({
    entity: props.tree,
    depth: props.event.depth
  });
});

export interface ReactorTreeNodeListener extends ReactorTreeListener, TreeNodeListener {
  childrenSortChanged: () => any;
}

export class ReactorTreeNode<T extends ReactorTreeNodeListener = ReactorTreeNodeListener> extends PatchTree(
  TreeNode
)<T> {
  private hasHydratedTreeState: boolean;
  private hasPersistedTreeState: boolean;

  constructor(public options: ReactorTreeOptions) {
    super(options.key || null);
    this.hasHydratedTreeState = false;
    this.hasPersistedTreeState = false;
    setupReactorTree(this, options);
  }

  private getRootNode(): ReactorTreeNode {
    return this.getRoot() as ReactorTreeNode;
  }

  private static didPersistTreeState(payload: TreeSerialized | TreeSerializedV2): boolean {
    // V2 payload uses `open: string[]` (including empty arrays).
    if (Array.isArray((payload as TreeSerializedV2).open)) {
      return true;
    }

    // V1 payload stores entries keyed by path.
    return Object.keys(payload || {}).length > 0;
  }

  get defaultOpenPolicy() {
    return this.options.defaultOpenPolicy || ReactorTreeNodeDefaultOpenPolicy.NEVER;
  }

  private shouldApplyDefaultOpenPolicy() {
    if (this.defaultOpenPolicy === ReactorTreeNodeDefaultOpenPolicy.ALWAYS) {
      return true;
    }
    if (this.defaultOpenPolicy === ReactorTreeNodeDefaultOpenPolicy.FIRST_RENDER) {
      return !this.getRootNode().hasPersistedTreeState;
    }
    return false;
  }

  private applyDefaultOpenPolicyToSubtree() {
    const stack: ReactorTreeNode[] = [this];
    while (stack.length > 0) {
      const node = stack.pop() as ReactorTreeNode;
      if (node.shouldApplyDefaultOpenPolicy()) {
        node.open({ reveal: false });
      }
      node.children.forEach((child) => {
        if (child instanceof ReactorTreeNode) {
          stack.push(child);
        }
      });
    }
  }

  deserialize(payload: TreeSerialized | TreeSerializedV2) {
    super.deserialize(payload);
    const root = this.getRootNode();
    root.hasHydratedTreeState = true;
    root.hasPersistedTreeState = ReactorTreeNode.didPersistTreeState(payload);
    root.applyDefaultOpenPolicyToSubtree();
  }

  renderWidget(event: CoreTreeWidgetProps): React.JSX.Element {
    return <ReactorTreeNodeWidget key={this.getKey()} tree={this} event={event} />;
  }

  match(event: SearchEvent): SearchEventMatch {
    return this.options.match?.(event);
  }

  setAttached(attached: boolean): any {
    super.setAttached(attached);
    this.children.forEach((child) => {
      if (isBaseReactorTree(child)) {
        child.setAttached(this.attached);
      }
    });
  }

  addChild(child: TreeEntity) {
    super.addChild(child);
    if (isBaseReactorTree(child)) {
      child.setAttached(this.attached);
      const l1 = child.registerListener({
        deleted: () => {
          l1?.();
          child.setAttached(false);
        },
        sortChanged: () => {
          this.iterateListeners((cb) => cb.childrenSortChanged?.());
        }
      });
    }

    if (child instanceof ReactorTreeNode) {
      const root = this.getRootNode();
      if (root.hasHydratedTreeState && child.shouldApplyDefaultOpenPolicy()) {
        child.open({ reveal: false });
      }
    }
  }

  get children() {
    return _.sortBy(super.children, (c) => {
      if (isBaseReactorTree(c)) {
        return c.getSortKey();
      }
      return c.getKey();
    });
  }
}

namespace S {
  export const Hidden = styled.div`
    display: none;
  `;
}
