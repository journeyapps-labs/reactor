import { TreeEntity } from '@journeyapps-labs/common-tree';
import * as React from 'react';
import { useEffect } from 'react';
import { CoreTreeWidgetProps } from '../CoreTreeWidget';
import { TreeLeafWidget } from '../../tree/TreeLeafWidget';
import { SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import { observer } from 'mobx-react';
import { PatchTree, ReactorTreeListener } from './PatchTree';
import { ReactorTreeOptions, setupReactorTree } from './reactor-tree-utils';

const ReactorTreeLeafWidget: React.FC<{
  tree: ReactorTreeLeaf;
  event: CoreTreeWidgetProps;
}> = observer(({ event, tree }) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const disposer = tree.registerListener({
      propGeneratorsChanged: () => {
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

  return <TreeLeafWidget forwardRef={event.forwardRef} {...tree.getProps(event)} depth={event.depth} />;
});

export class ReactorTreeLeaf<T extends ReactorTreeListener = ReactorTreeListener> extends PatchTree(TreeEntity)<T> {
  constructor(public options: ReactorTreeOptions) {
    super(options.key || null);
    setupReactorTree(this, options);
  }

  renderWidget(event: CoreTreeWidgetProps): React.JSX.Element {
    return <ReactorTreeLeafWidget key={this.getKey()} tree={this} event={event} />;
  }

  match(event: SearchEvent): SearchEventMatch {
    return this.options.match?.(event);
  }
}
