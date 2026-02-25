import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from './CoreTreeWidget';
import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import { createSearchEventMatcher, SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { observer } from 'mobx-react';
import { isBaseReactorTree } from './reactor-tree/reactor-tree-utils';
import { ReactorTreeNode } from './reactor-tree/ReactorTreeNode';
import _ from 'lodash';
import { SearchableTreeSearchScope } from './SearchableTreeSearchScope';

export interface SearchableCoreTreeWidgetProps extends CoreTreeWidgetProps {
  search: string;
  searchScope?: SearchableTreeSearchScope;

  matchLeaf?(event: SearchEvent & { tree: TreeEntity }): SearchEventMatch;

  matchNode?(event: SearchEvent & { tree: TreeNode }): SearchEventMatch;

  onSearchResultChanged?: (event: { matched: TreeEntity[] }) => any;
}

const useSearchMatcher = (search: string) => {
  return useMemo<SearchEvent>(() => {
    if (!search) {
      return null;
    }
    return {
      search,
      matches: createSearchEventMatcher(search)
    };
  }, [search]);
};

const useTreeVersionListeners = (
  entities: TreeEntity[],
  setTreeVersion: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const bump = () => {
      setTreeVersion((v) => v + 1);
    };

    const listeners = entities
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
  }, [entities, setTreeVersion]);
};

const FilteredCoreTreeWidget: React.FC<
  SearchableCoreTreeWidgetProps & {
    entities: TreeEntity[];
    matcher: SearchEvent;
    revealMatch: boolean;
    setTreeVersion: React.Dispatch<React.SetStateAction<number>>;
  }
> = (props) => {
  const { entities, matcher, revealMatch, setTreeVersion, renderTreeEntity: _renderTreeEntity, ...rest } = props;

  const searchState = useMemo(() => {
    const matched = entities.filter((l) => {
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
  }, [entities, matcher, props.matchLeaf, props.matchNode]);

  useEffect(() => {
    entities.forEach((t) => {
      if (isBaseReactorTree(t)) {
        t.setSearch(matcher, { revealMatch });
      }
    });

    return () => {
      entities.forEach((t) => {
        if (isBaseReactorTree(t)) {
          t.setSearch(null);
        }
      });
    };
  }, [entities, matcher, revealMatch]);

  useEffect(() => {
    props.onSearchResultChanged?.({
      matched: searchState.matched
    });
  }, [searchState, props.onSearchResultChanged]);

  useEffect(() => {
    if (!matcher) {
      return;
    }
    const deferred = _.defer(() => {
      setTreeVersion((v) => v + 1);
    });
    return () => {
      clearTimeout(deferred as any);
    };
  }, [matcher, setTreeVersion]);

  return (
    <CoreTreeWidget
      {...rest}
      renderTreeEntity={(tree) => {
        if (props.search) {
          if (tree === props.tree) {
            return true;
          }
          return searchState.allowed.has(tree.getPathAsString());
        }
        return true;
      }}
    />
  );
};

const SearchableCoreTreeWidgetVisibleMode: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const [treeVersion, setTreeVersion] = useState(0);
  const matcher = useSearchMatcher(props.search);

  const visibleEntities = useMemo(() => {
    const entities: TreeEntity[] = [];
    const walk = (tree: TreeEntity) => {
      entities.push(tree);
      if (!(tree instanceof TreeNode) || tree.collapsed) {
        return;
      }
      tree.children.forEach((child) => {
        walk(child);
      });
    };
    walk(props.tree);
    return entities;
  }, [props.tree, treeVersion]);

  useTreeVersionListeners(visibleEntities, setTreeVersion);
  return (
    <FilteredCoreTreeWidget
      {...props}
      entities={visibleEntities}
      matcher={matcher}
      revealMatch={false}
      setTreeVersion={setTreeVersion}
    />
  );
});

const SearchableCoreTreeWidgetFullMode: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const [treeVersion, setTreeVersion] = useState(0);
  const matcher = useSearchMatcher(props.search);
  const openedBySearchRef = useRef<Set<ReactorTreeNode>>(new Set());

  const flattened = useMemo(() => {
    return props.tree.flatten();
  }, [props.tree, treeVersion]);

  useTreeVersionListeners(flattened, setTreeVersion);

  const restoreNodesOpenedBySearch = useCallback(() => {
    openedBySearchRef.current.forEach((tree) => {
      if (!tree.collapsed) {
        tree.setCollapsed(true);
      }
    });
    openedBySearchRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      restoreNodesOpenedBySearch();
    };
  }, [restoreNodesOpenedBySearch]);

  useEffect(() => {
    if (!matcher) {
      restoreNodesOpenedBySearch();
      return;
    }
    // In searchable mode, reveal lazy node branches so descendants can attach/load
    // and participate in deep matching.
    flattened.forEach((tree) => {
      if (tree instanceof ReactorTreeNode) {
        if (tree.collapsed) {
          openedBySearchRef.current.add(tree);
          tree.open({ reveal: true });
        }
      }
    });
  }, [flattened, matcher, restoreNodesOpenedBySearch]);

  return (
    <FilteredCoreTreeWidget
      {...props}
      entities={flattened}
      matcher={matcher}
      revealMatch={true}
      setTreeVersion={setTreeVersion}
    />
  );
});

export const SearchableCoreTreeWidget: React.FC<SearchableCoreTreeWidgetProps> = (props) => {
  if ((props.searchScope || SearchableTreeSearchScope.FULL_TREE) === SearchableTreeSearchScope.VISIBLE_ONLY) {
    return <SearchableCoreTreeWidgetVisibleMode {...props} />;
  }
  return <SearchableCoreTreeWidgetFullMode {...props} />;
};
