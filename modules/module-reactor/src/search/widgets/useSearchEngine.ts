import { SearchEngine } from '../SearchEngine';
import { useEffect, useState } from 'react';
import { SearchResult } from '@journeyapps-labs/lib-reactor-search';

export interface UseSearchEngineProps {
  searchEngine: SearchEngine;
  searchText: string;
  parameters: object;
}

export const useSearchEngine = (props: UseSearchEngineProps) => {
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  useEffect(() => {
    let value = props.searchText;
    if (value && value.trim() === '') {
      value = null;
    }
    if (searchResult) {
      searchResult.dispose();
    }
    setSearchResult(
      props.searchEngine.search({
        value,
        parameters: props.parameters
      })
    );
  }, [props.searchText]);

  return searchResult;
};
