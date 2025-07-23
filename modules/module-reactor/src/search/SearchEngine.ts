import { SearchResult } from '@journeyapps-labs/lib-reactor-search';
import { SearchEngineParameter } from './params/SearchEngineParameter';

export interface SearchEngineSearchEvent<T extends object = {}> {
  value: string;
  parameters?: T;
}

export abstract class SearchEngine<T extends SearchResult = SearchResult> {
  parameters: Set<SearchEngineParameter>;

  constructor() {
    this.parameters = new Set();
  }

  addParameter(param: SearchEngineParameter) {
    this.parameters.add(param);
  }

  abstract search(event: SearchEngineSearchEvent): T;
}
