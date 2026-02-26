import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TreeLeafWidget } from '../../../tree/TreeLeafWidget';
import { CoreTreeWidgetProps } from '../../CoreTreeWidget';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';
import { useTreeEntity } from './useTreeEntity';
import type { ReactorTreeLeaf } from '../ReactorTreeLeaf';

export interface ReactorTreeLeafWidgetProps {
  tree: ReactorTreeLeaf;
  event: CoreTreeWidgetProps;
}

export const ReactorTreeLeafWidget: React.FC<ReactorTreeLeafWidgetProps> = observer(({ event, tree }) => {
  const forceUpdate = useForceUpdate();
  const [render, setRender] = useState(true);

  useEffect(() => {
    const disposer = tree.registerListener({
      propGeneratorsChanged: () => {
        forceUpdate({
          defer: true
        });
      }
    });
    forceUpdate({
      defer: true
    });
    return disposer;
  }, [tree]);

  useLayoutEffect(() => {
    const res = tree.setSearch(event.search);
    if (event.search) {
      setRender(res);
      event.hasMatchedChildren?.(res);
    } else {
      setRender(true);
    }
  }, [event.search]);

  useTreeEntity({ tree });

  if (!render) {
    return null;
  }

  return <TreeLeafWidget forwardRef={event.forwardRef} {...tree.getProps(event)} depth={event.depth} />;
});
