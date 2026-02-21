import { TreeEntity, TreeNode, TreeNodeListener } from '@journeyapps-labs/common-tree';
import { TreeWidget } from '../../tree/TreeWidget';
import * as _ from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from '../CoreTreeWidget';
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import { observer } from 'mobx-react';
import { PatchTree, ReactorTreeListener } from './PatchTree';
import { isBaseReactorTree, ReactorTreeOptions, setupReactorTree } from './reactor-tree-utils';
import { SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';

const ReactorTreeNodeWidget: React.FC<{
  tree: ReactorTreeNode;
  event: CoreTreeWidgetProps;
}> = observer(({ event, tree }) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const disposer = tree.registerListener({
      propGeneratorsChanged: () => {
        forceUpdate({
          defer: true
        });
      },
      childAdded: () => {
        forceUpdate({
          defer: true
        });
      },
      childRemoved: () => {
        forceUpdate({
          defer: true
        });
      },
      collapsedChanged: () => {
        forceUpdate({
          defer: true
        });
        event.events?.updated?.();
      },
      sortChanged: () => {
        forceUpdate({
          defer: true
        });
      }
    });
    // Ensure we render once after listener registration so stale props
    // (for example old search matches) are not kept until the next hover/update.
    forceUpdate({
      defer: true
    });
    return disposer;
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

  const treeProps = tree.getProps(event);
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
      {(depth) => {
        return _.map(tree.children, (element) => {
          return (
            <CoreTreeWidget
              key={element.getPathAsString()}
              {..._.omit(event, 'forwardRef')}
              depth={depth}
              tree={element}
            />
          );
        });
      }}
    </TreeWidget>
  );
});

export interface ReactorTreeNodeListener extends ReactorTreeListener, TreeNodeListener {
  childrenSortChanged: () => any;
}

export class ReactorTreeNode<T extends ReactorTreeNodeListener = ReactorTreeNodeListener> extends PatchTree(
  TreeNode
)<T> {
  constructor(public options: ReactorTreeOptions) {
    super(options.key || null);
    setupReactorTree(this, options);
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
