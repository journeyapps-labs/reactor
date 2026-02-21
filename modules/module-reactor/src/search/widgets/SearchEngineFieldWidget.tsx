import * as React from 'react';
import { SearchEngine } from '../SearchEngine';
import { SearchWidget } from '../../widgets/search/SearchWidget';
import { useSearchEngine } from './useSearchEngine';
import { useEffect, useState } from 'react';
import { SearchResult } from '@journeyapps-labs/lib-reactor-search';

export interface SearchEngineFieldWidgetProps {
  engine: SearchEngine;
  gotSearchResult: (result: SearchResult | null) => any;
  focusOnMount?: boolean;
  className?: any;
  parameters?: object;
}

export const SearchEngineFieldWidget: React.FC<SearchEngineFieldWidgetProps> = (props) => {
  const [value, setValue] = useState<string>(null);

  const result = useSearchEngine({
    searchEngine: props.engine,
    searchText: value,
    parameters: props.parameters || {}
  });

  useEffect(() => {
    props.gotSearchResult(result);
  }, [result]);

  return (
    <div className={props.className}>
      <SearchWidget
        focusOnMount={props.focusOnMount}
        search={value}
        searchChanged={(value) => {
          setValue(value);
        }}
      />
    </div>
  );
};
