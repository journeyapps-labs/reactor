import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from './CoreTreeWidget';
import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import { createSearchEventMatcher, SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { observer } from 'mobx-react';
import { isBaseReactorTree } from './reactor-tree/reactor-tree-utils';

export interface SearchableCoreTreeWidgetProps extends CoreTreeWidgetProps {
  search: string;

  matchLeaf?(event: SearchEvent & { tree: TreeEntity }): SearchEventMatch;

  matchNode?(event: SearchEvent & { tree: TreeNode }): SearchEventMatch;

  onSearchResultChanged?: (event: { matched: TreeEntity[] }) => any;
}

export const SearchableCoreTreeWidget: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const matcher = useMemo<SearchEvent>(() => {
    if (!props.search) {
      return null;
    }
    return {
      search: props.search,
      matches: createSearchEventMatcher(props.search)
    };
  }, [props.search]);

  const searchState = useMemo(() => {
    const matched = props.tree.flatten().filter((l) => {
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
  }, [matcher, props.tree, props.matchLeaf, props.matchNode]);

  useEffect(() => {
    const flattened = props.tree.flatten();
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
  }, [props.tree, matcher]);

  useEffect(() => {
    props.onSearchResultChanged?.({
      matched: searchState.matched
    });
  }, [searchState, props.onSearchResultChanged]);

  return (
    <CoreTreeWidget
      renderTreeEntity={(tree) => {
        if (props.search) {
          return searchState.allowed.has(tree.getPathAsString());
        }
        return true;
      }}
      {...props}
    />
  );
});
