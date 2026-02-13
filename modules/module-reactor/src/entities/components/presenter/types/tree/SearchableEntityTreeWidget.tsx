import React from 'react';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { SearchableCoreTreeWidget } from '../../../../../widgets/core-tree/SearchableCoreTreeWidget';
import { ReactorTreeEntity } from '../../../../../widgets/core-tree/reactor-tree/reactor-tree-utils';
import { TreeEntity } from '@journeyapps-labs/common-tree';
import { PanelPlaceholderWidget } from '../../../../../widgets/panel/panel/PanelPlaceholderWidget';
import { useForceUpdate } from '../../../../../hooks/useForceUpdate';

export interface SearchableEntityTreeWidgetProps {
  nodes: ReactorTreeEntity[];
  search: string;
}

export const SearchableEntityTreeWidget: React.FC<SearchableEntityTreeWidgetProps> = (props) => {
  const { nodes, search } = props;
  const searchMatchesByTreeRef = useRef<Record<string, boolean>>({});
  const receivedSearchEventsRef = useRef<boolean>(false);
  const forceUpdate = useForceUpdate();
  const treeKeys = useMemo(() => {
    return nodes.map((tree) => tree.getPathAsString()).join('|');
  }, [nodes]);
  const searchMatchUpdateDebounced = useRef(
    _.debounce(
      () => {
        forceUpdate();
      },
      50,
      { leading: false, trailing: true }
    )
  ).current;

  useEffect(() => {
    searchMatchesByTreeRef.current = {};
    receivedSearchEventsRef.current = false;
    searchMatchUpdateDebounced.cancel();

    return () => {
      searchMatchUpdateDebounced.cancel();
    };
  }, [search, treeKeys, searchMatchUpdateDebounced]);

  const setTreeSearchMatches = useCallback(
    (treePath: string, matched: TreeEntity[]) => {
      const hasMatches = matched.length > 0;
      receivedSearchEventsRef.current = true;
      if (searchMatchesByTreeRef.current[treePath] === hasMatches) {
        return;
      }
      searchMatchesByTreeRef.current[treePath] = hasMatches;
      searchMatchUpdateDebounced();
    },
    [searchMatchUpdateDebounced]
  );

  const showNoSearchResults =
    receivedSearchEventsRef.current && !Object.values(searchMatchesByTreeRef.current).some((v) => !!v);

  if (showNoSearchResults) {
    return <PanelPlaceholderWidget center={true} icon="search" text="No search results" />;
  }

  return (
    <>
      {nodes.map((tree) => {
        return (
          <SearchableCoreTreeWidget
            tree={tree}
            key={tree.getPathAsString()}
            search={search}
            onSearchResultChanged={(result) => {
              setTreeSearchMatches(tree.getPathAsString(), result.matched);
            }}
          />
        );
      })}
    </>
  );
};
