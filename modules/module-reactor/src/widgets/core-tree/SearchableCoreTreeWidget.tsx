import * as React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { CoreTreeWidget, CoreTreeWidgetProps } from './CoreTreeWidget';
import { TreeEntity, TreeNode } from '@journeyapps-labs/common-tree';
import { createSearchEventMatcher, SearchEvent, SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';
import { observer } from 'mobx-react';
import { UniversalNodeWidget } from './reactor-tree/ReactorTreeNode';
import * as _ from 'lodash';

export interface SearchableCoreTreeWidgetProps extends Omit<CoreTreeWidgetProps, 'search'> {
  search?: string;
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

const FilteredCoreTreeWidget: React.FC<
  SearchableCoreTreeWidgetProps & {
    matcher: SearchEvent;
    revealMatch: boolean;
  }
> = observer((props) => {
  const { matcher, revealMatch: _renderTreeEntity, ...rest } = props;

  return <CoreTreeWidget {...rest} search={props.matcher} />;
});

const SearchableCoreTreeWidgetFullMode: React.FC<SearchableCoreTreeWidgetProps> = observer((props) => {
  const matcher = useSearchMatcher(props.search);
  return <FilteredCoreTreeWidget {...props} matcher={matcher} revealMatch={true} />;
});

export const SearchableCoreTreeWidgetInner: React.FC<SearchableCoreTreeWidgetProps> = (props) => {
  const [initialState] = useState(() => {
    if (props.tree instanceof TreeNode) {
      return props.tree.serialize();
    }
    return null;
  });

  useLayoutEffect(() => {
    return () => {
      if (props.tree instanceof TreeNode) {
        props.tree.deserialize(initialState);
      }
    };
  }, []);

  return <SearchableCoreTreeWidgetFullMode {...props} />;
};

export const SearchableCoreTreeWidget: React.FC<SearchableCoreTreeWidgetProps> = (props) => {
  let _search = props.search;
  if (_search && _search.trim() === '') {
    _search = null;
  }
  if (!_search) {
    return <UniversalNodeWidget {...props} event={_.omit(props, 'search')} />;
  }
  return <SearchableCoreTreeWidgetInner {...props} />;
};
