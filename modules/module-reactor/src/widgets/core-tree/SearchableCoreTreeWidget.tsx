import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from './CoreTreeWidget';
import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import { createSearchEventMatcher, SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { observer } from 'mobx-react';
import { isBaseReactorTree } from './reactor-tree/reactor-tree-utils';

export interface SearchableCoreTreeWidgetProps extends CoreTreeWidgetProps {
  search: string;

  matchLeaf(event: SearchEvent & { tree: TreeEntity }): SearchEventMatch;

  matchNode(event: SearchEvent & { tree: TreeNode }): SearchEventMatch;
}

export const SearchableCoreTreeWidget: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const [matcher, setMatcher] = useState<SearchEvent>(null);
  const [allowed, setAllowed] = useState<string[]>([]);
  useEffect(() => {
    return () => {
      props.tree.flatten().forEach((t) => {
        if (isBaseReactorTree(t)) {
          t.setSearch(null);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (props.search) {
      setMatcher({
        search: props.search,
        matches: createSearchEventMatcher(props.search)
      });
    } else {
      setMatcher(null);
    }
  }, [props.search]);

  useMemo(() => {
    const leafs = props.tree.flatten();
    const filtered = leafs.filter((l) => {
      if (isBaseReactorTree(l)) {
        return l.setSearch(matcher);
      } else if (l instanceof TreeNode) {
        return props.matchNode({
          ...matcher,
          tree: l
        });
      }

      return props.matchLeaf({
        ...matcher,
        tree: l
      });
    });

    const allowedSet = new Set<TreeEntity>();
    filtered.forEach((l) => {
      let entity = l;
      do {
        if (!allowedSet.has(entity)) {
          allowedSet.add(entity);
        }
        entity = entity.getParent();
      } while (entity);
    });

    setAllowed(Array.from(allowedSet.values()).map((f) => f.getPathAsString()));
  }, [matcher]);

  return (
    <CoreTreeWidget
      renderTreeEntity={(tree) => {
        if (props.search) {
          return allowed.indexOf(tree.getPathAsString()) !== -1;
        }
        return true;
      }}
      {...props}
    />
  );
});
