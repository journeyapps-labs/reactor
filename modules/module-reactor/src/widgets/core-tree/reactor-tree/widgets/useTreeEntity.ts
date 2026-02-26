import { useEffect, useLayoutEffect, useState } from 'react';
import { ReactorTreeEntity } from '../reactor-tree-utils';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';
import { CoreTreeWidgetProps } from '../../CoreTreeWidget';

export const useTreeEntity = (options: { tree: ReactorTreeEntity; event: CoreTreeWidgetProps }) => {
  const { tree, event } = options;
  const forceUpdate = useForceUpdate();
  const [render, setRender] = useState(true);

  // handle prop generators changing
  useEffect(() => {
    return tree.registerListener({
      propGeneratorsChanged: () => {
        forceUpdate({
          defer: true
        });
      }
    });
  }, [tree]);

  // handle search
  useLayoutEffect(() => {
    const res = tree.setSearch(event.search);
    if (event.search) {
      setRender(res);
      event.hasMatchedChildren?.(res);
    } else {
      setRender(true);
    }
  }, [tree, event.search]);

  // handle layout change
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

  return {
    render
  };
};
