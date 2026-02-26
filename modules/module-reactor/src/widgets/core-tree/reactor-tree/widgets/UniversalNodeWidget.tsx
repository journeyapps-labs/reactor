import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import * as React from 'react';
import { observer } from 'mobx-react';
import { CoreTreeWidgetProps } from '../../CoreTreeWidget';
import { isBaseReactorTree, ReactorTreeEntity } from '../reactor-tree-utils';
import { BaseTreeNodeWidget } from './BaseTreeNodeWidget';
import { ReactorTreeNodeWidget } from './ReactorTreeNodeWidget';
import { RenderTreeChildOptions } from './useTreeChildren';

const isReactorTreeNode = (tree: TreeEntity): tree is TreeNode & ReactorTreeEntity =>
  tree instanceof TreeNode && isBaseReactorTree(tree as any);

const isReactorTreeLeaf = (tree: TreeEntity): tree is ReactorTreeEntity =>
  !(tree instanceof TreeNode) && isBaseReactorTree(tree as any);

export const UniversalNodeWidget: React.FC<{
  tree: TreeEntity;
  event: CoreTreeWidgetProps;
}> = observer((props) => {
  const renderChild = ({ child, depth, event, reportMatched }: RenderTreeChildOptions) => {
    return (
      <UniversalNodeWidget
        key={child.getPathAsString()}
        tree={child}
        event={{
          ...event,
          hasMatchedChildren: (match) => {
            reportMatched(match);
          },
          depth
        }}
      />
    );
  };

  if (isReactorTreeNode(props.tree)) {
    return <ReactorTreeNodeWidget event={props.event} tree={props.tree} renderChild={renderChild} />;
  }

  if (props.tree instanceof TreeNode) {
    return <BaseTreeNodeWidget event={props.event} tree={props.tree} renderChild={renderChild} />;
  }

  if (isReactorTreeLeaf(props.tree)) {
    return props.tree.renderWidget(props.event);
  }

  return props.event.renderTreeLeaf({
    entity: props.tree,
    depth: props.event.depth
  });
});
