import * as React from 'react';
import { TreeEntity, TreeEntityInterface, TreeNode } from '@journeyapps-labs/common-tree';
import { TreeWidgetProps } from '../tree/TreeWidget';
import { observer } from 'mobx-react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import * as _ from 'lodash';
import { ReactorTreeNode } from './reactor-tree/ReactorTreeNode';
import { ReactorTreeLeaf } from './reactor-tree/ReactorTreeLeaf';

export interface CoreRenderTreeEvent<T extends TreeEntityInterface = TreeEntityInterface> {
  entity: T;
  depth: number;
}

export interface CoreRenderTreeNodeEvent<T extends TreeNode = TreeNode> extends CoreRenderTreeEvent<T> {
  children: () => any;
  props: Pick<TreeWidgetProps, 'onCollapsedChanged' | 'collapsed'>;
}

export interface CoreRenderTreeLeafEvent<T extends TreeEntity = TreeEntity> extends CoreRenderTreeEvent<T> {}

export interface CoreTreeWidgetProps {
  tree: TreeEntity;
  depth?: number;
  forwardRef?: React.RefObject<HTMLDivElement>;
  renderTreeNode?: (event: CoreRenderTreeNodeEvent) => React.JSX.Element;
  renderTreeLeaf?: (event: CoreRenderTreeLeafEvent) => React.JSX.Element;
  renderTreeEntity?: (entity: TreeEntity) => boolean;
  trimEmptyNodes?: boolean;
  events?: {
    updated: () => any;
  };
}

export const CoreTreeWidget: React.FC<CoreTreeWidgetProps> = observer((props) => {
  const forceUpdate = useForceUpdate();

  if (props.renderTreeEntity?.(props.tree) === false) {
    return null;
  }
  // it's a reactor tree
  if (props.tree instanceof ReactorTreeNode) {
    return props.tree.renderWidget(props) || null;
  }

  // it's a normal tree
  else if (props.tree instanceof TreeNode) {
    return props.renderTreeNode({
      entity: props.tree,
      depth: props.depth,
      props: {
        collapsed: props.tree.collapsed,
        onCollapsedChanged: (collapsed) => {
          (props.tree as TreeNode).setCollapsed(collapsed);
          forceUpdate();
          props.events?.updated?.();
        }
      },
      children: () => {
        return (props.tree as TreeNode).children.map((c) => {
          return <CoreTreeWidget {..._.omit(props, 'forwardRef')} depth={props.depth + 1} tree={c} key={c.getKey()} />;
        });
      }
    });
  }
  // it's a reactor leaf
  else if (props.tree instanceof ReactorTreeLeaf) {
    return props.tree.renderWidget(props);
  }

  // it's a normal leaf
  return props.renderTreeLeaf({
    depth: props.depth,
    entity: props.tree
  });
});
