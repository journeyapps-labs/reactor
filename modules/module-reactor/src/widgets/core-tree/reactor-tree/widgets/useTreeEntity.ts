import { useEffect } from 'react';
import { ReactorTreeEntity } from '../reactor-tree-utils';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';

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
