import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from './CoreTreeWidget';
import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import { createSearchEventMatcher, SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { observer } from 'mobx-react';
import { isBaseReactorTree } from './reactor-tree/reactor-tree-utils';
import { ReactorTreeNode } from './reactor-tree/ReactorTreeNode';
import _ from 'lodash';

export interface SearchableCoreTreeWidgetProps extends CoreTreeWidgetProps {
  search: string;

  matchLeaf?(event: SearchEvent & { tree: TreeEntity }): SearchEventMatch;

  matchNode?(event: SearchEvent & { tree: TreeNode }): SearchEventMatch;

  onSearchResultChanged?: (event: { matched: TreeEntity[] }) => any;
}

export const SearchableCoreTreeWidget: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const [treeVersion, setTreeVersion] = useState(0);

  const matcher = useMemo<SearchEvent>(() => {
    if (!props.search) {
      return null;
    }
    return {
      search: props.search,
      matches: createSearchEventMatcher(props.search)
    };
  }, [props.search]);

  const flattened = useMemo(() => {
    return props.tree.flatten();
  }, [props.tree, treeVersion]);

  useEffect(() => {
    const bump = () => {
      setTreeVersion((v) => v + 1);
    };

    const listeners = flattened
      .filter((t) => isBaseReactorTree(t))
      .map((t) => {
        return t.registerListener({
          childAdded: bump,
          childRemoved: bump,
          collapsedChanged: bump,
          attachedChanged: bump,
          childrenSortChanged: bump,
          deleted: bump
        } as any);
      });

    return () => {
      listeners.forEach((dispose) => dispose?.());
    };
  }, [flattened]);

  useEffect(() => {
    if (!matcher) {
      return;
    }
    // In searchable mode, reveal lazy node branches so descendants can attach/load
    // and participate in deep matching.
    flattened.forEach((tree) => {
      if (tree instanceof ReactorTreeNode) {
        if (tree.collapsed) {
          tree.open({ reveal: true });
        }
      }
    });
  }, [flattened, matcher]);

  useEffect(() => {
    if (!matcher) {
      return;
    }
    // One-shot post-search refresh: in some lazy-tree cases, descendants can attach/load
    // before this widget's mutation listeners are registered (especially when a node is
    // already open). Triggering one deferred pass closes that race.
    const deferred = _.defer(() => {
      setTreeVersion((v) => v + 1);
    });
    return () => {
      clearTimeout(deferred as any);
    };
  }, [matcher]);

  const searchState = useMemo(() => {
    const matched = flattened.filter((l) => {
      if (isBaseReactorTree(l)) {
        if (!matcher) {
          return true;
        }
        return !!l.match(matcher);
      } else if (l instanceof TreeNode) {
        return (
          props.matchNode?.({
            ...matcher,
            tree: l
          }) ?? false
        );
      }

      return (
        props.matchLeaf?.({
          ...matcher,
          tree: l
        }) ?? false
      );
    });

    const allowedSet = new Set<TreeEntity>();
    matched.forEach((l) => {
      let entity = l;
      do {
        if (!allowedSet.has(entity)) {
          allowedSet.add(entity);
        }
        entity = entity.getParent();
      } while (entity);
    });

    return {
      matched,
      allowed: new Set(Array.from(allowedSet.values()).map((f) => f.getPathAsString()))
    };
  }, [flattened, matcher, props.matchLeaf, props.matchNode]);

  useEffect(() => {
    flattened.forEach((t) => {
      if (isBaseReactorTree(t)) {
        t.setSearch(matcher);
      }
    });

    return () => {
      flattened.forEach((t) => {
        if (isBaseReactorTree(t)) {
          t.setSearch(null);
        }
      });
    };
  }, [flattened, matcher]);

  useEffect(() => {
    props.onSearchResultChanged?.({
      matched: searchState.matched
    });
  }, [searchState, props.onSearchResultChanged]);

  return (
    <CoreTreeWidget
      renderTreeEntity={(tree) => {
        if (props.search) {
          // Keep the root mounted during search so descendants can attach/load
          // and discover deep matches before filtering settles.
          if (tree === props.tree) {
            return true;
          }
          return searchState.allowed.has(tree.getPathAsString());
        }
        return true;
      }}
      {...props}
    />
  );
});
