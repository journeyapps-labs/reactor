import { autorun } from 'mobx';
import { ReactorTreeLeaf, ReactorTreeNode } from '../widgets';
import { SearchResult, SearchResultEntry } from '@journeyapps-labs/lib-reactor-search';

export interface SetupNodeOptions<T extends SearchResultEntry> {
  result: SearchResult<T>;
  node: ReactorTreeNode;
  getTreeEntity: (entity: T) => ReactorTreeLeaf | ReactorTreeNode;
}

export const setupNode = <T extends SearchResultEntry>(options: SetupNodeOptions<T>) => {
  const l1 = autorun(() => {
    // clear existing children
    options.node.children.forEach((c) => {
      c.delete();
    });

    options.result.results
      .map((r) => {
        return options.getTreeEntity(r);
      })
      .forEach((e) => {
        options.node.addChild(e);
      });

    // load more entry
    if (options.result.moreEntries) {
      const loadMore = new ReactorTreeLeaf({
        key: '__load_more',
        getTreeProps: () => {
          return {
            label: 'Load more'
          };
        }
      });
      loadMore.registerListener({
        action: () => {
          options.result.loadMore();
        }
      });

      options.node.addChild(loadMore);
    }
  });
  const l2 = options.result.registerListener({
    dispose: () => {
      l2();
      l1();
    }
  });
};
