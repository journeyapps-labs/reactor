import { TreeNode } from '@journeyapps-labs/common-tree';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TreeWidget } from '../../../tree/TreeWidget';
import { CoreTreeWidgetProps } from '../../CoreTreeWidget';
import { ReactorTreeEntity } from '../reactor-tree-utils';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';
import { useTreeEntity } from './useTreeEntity';
import { useTreeNode } from './useTreeNode';
import { useTreeChildren, RenderTreeChild } from './useTreeChildren';

export interface ReactorTreeNodeWidgetProps {
  tree: TreeNode & ReactorTreeEntity;
  event: CoreTreeWidgetProps;
  renderChild: RenderTreeChild;
}

export const ReactorTreeNodeWidget: React.FC<ReactorTreeNodeWidgetProps> = observer((props) => {
  const { tree, event, renderChild } = props;
  const forceUpdate = useForceUpdate();
  useTreeNode(tree, event.events?.updated);
  useTreeEntity({ tree });

  const { renderChildren, childrenHasMatches } = useTreeChildren({ tree, event, renderChild });
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
    const res = tree.setSearch(event.search);
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
        {(depth) => {
          return renderChildren(depth);
        }}
      </TreeWidget>
    );
  }

  return <>{renderChildren(event.depth + 1)}</>;
});
