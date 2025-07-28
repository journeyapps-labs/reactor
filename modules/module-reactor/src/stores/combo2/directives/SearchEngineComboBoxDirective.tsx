import { ComboBoxDirective, ComboBoxDirectiveOptions } from '../ComboBoxDirective';
import { makeObservable, observable } from 'mobx';
import { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import { SearchEngine } from '../../../search/SearchEngine';
import * as React from 'react';
import { SearchEngineFieldWidget } from '../../../search/widgets/SearchEngineFieldWidget';
import { ComboBoxWidget } from '../../../layers/combo/ComboBoxWidget';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { SearchResult, SearchResultEntry } from '@journeyapps-labs/lib-reactor-search';

export interface SearchEngineComboBoxDirectiveOptions<
  E extends SearchResultEntry,
  T extends ComboBoxItem = ComboBoxItem
> extends ComboBoxDirectiveOptions {
  engine: SearchEngine<SearchResult<E>>;
  transformResult: (item: E) => T;
  filter?: (entity: E) => boolean;
}

export class SearchEngineComboBoxDirective<
  E extends SearchResultEntry = SearchResultEntry,
  T extends ComboBoxItem = ComboBoxItem
> extends ComboBoxDirective<T, SearchEngineComboBoxDirectiveOptions<E, T>> {
  @observable
  private accessor result: SearchResult<E>;

  @observable
  accessor parameters: {};

  constructor(options: SearchEngineComboBoxDirectiveOptions<E, T>) {
    super(options);
    this.result = null;
    this.parameters = {};
  }

  get engine() {
    return this.options.engine;
  }

  dismiss() {
    super.dismiss();
    this.result?.dispose();
  }

  setResult(result: SearchResult<E>) {
    this.result?.dispose();
    this.result = result;
  }

  getItems() {
    if (!this.result) {
      return [];
    }
    return this.result?.results
      .filter((r) => {
        if (!this.options.filter) {
          return true;
        }
        return this.options.filter(r);
      })
      .map((r) => this.options.transformResult(r));
  }

  selectItem(item: T) {
    this.setSelected([item]);
  }

  setSelected(items: T[]) {
    super.setSelected(items);
    this.dismiss();
    this.getItems().forEach((i) => {
      i.action?.(this.getPosition());
    });
  }

  getContent(): React.JSX.Element {
    return <SearchEngineComboBoxDirectiveWidget directive={this} />;
  }
}

export interface SearchEngineComboBoxDirectiveWidgetProps {
  directive: SearchEngineComboBoxDirective;
}

export const SearchEngineComboBoxDirectiveWidget: React.FC<SearchEngineComboBoxDirectiveWidgetProps> = observer(
  (props) => {
    return (
      <>
        <S.Search
          engine={props.directive.engine}
          focusOnMount={true}
          parameters={props.directive.parameters}
          gotSearchResult={(result) => {
            props.directive.setResult(result);
          }}
        />
        <ComboBoxWidget
          initialSelected={null}
          placeholder={props.directive.searchPlaceholder}
          items={props.directive.getItems()}
          selected={(item, event) => {
            props.directive.selectItem(item);
          }}
        />
      </>
    );
  }
);

namespace S {
  export const Search = styled(SearchEngineFieldWidget)`
    margin-bottom: 5px;
    min-width: 200px;
  `;
}
