import { SearchResult, SearchResultEntry } from '@journeyapps-labs/lib-reactor-search';
import { SerializedEntity } from './Provider';
import { makeObservable, observable } from 'mobx';

export interface ProviderSearchResultEntity<ENTITY = any> extends SearchResultEntry {
  entity: ENTITY;
}

export interface ProviderSearchResultSerialized<
  ENTITY = any,
  SERIALIZED extends SerializedEntity = SerializedEntity
> extends ProviderSearchResultEntity<ENTITY> {
  serialized: SERIALIZED;
}

export class ProviderSearchResult<
  T extends ProviderSearchResultEntity = ProviderSearchResultEntity
> extends SearchResult<T> {
  @observable
  accessor footerHint: string;

  constructor() {
    super();
    this.footerHint = null;
  }

  setFooterHint(hint: string) {
    this.footerHint = hint;
  }
}
