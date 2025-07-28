import { observer } from 'mobx-react';
import * as React from 'react';
import * as _ from 'lodash';
import { ComboBoxItem, ProviderComboBoxItem, UIProviderDirective } from '../../../stores/combo/ComboBoxDirectives';
import { SmartPositionWidget } from '../SmartPositionWidget';
import { ComboSearchBoxWidget } from '../ComboSearchBoxWidget';
import { ProviderSearchResult } from '../../../providers';
import { createSearchEventMatcher } from '@journeyapps-labs/lib-reactor-search';

export interface ProviderDirectiveComboWidgetProps {
  directive: UIProviderDirective;
  resolve: (item) => any;
}

export interface ProviderDirectiveComboWidgetState {
  searchResult: ProviderSearchResult;
  search: string;
}

@observer
export class ProviderDirectiveComboWidget extends React.Component<
  ProviderDirectiveComboWidgetProps,
  ProviderDirectiveComboWidgetState
> {
  static CALLOUT_KEY = '___CALLOUT___';

  constructor(props) {
    super(props);
    this.state = {
      searchResult: null,
      search: null
    };
  }

  getItems() {
    if (!this.state.searchResult) {
      return [];
    }
    const res: ProviderComboBoxItem[] = _.chain(this.state.searchResult.results)
      // params can sometimes filter first
      .filter((result) => {
        if (this.props.directive.filter) {
          return this.props.directive.filter(result.entity);
        }
        return true;
      })
      .map((result) => {
        const s = this.props.directive.provider.serialize(result.entity);
        return {
          key: result.key,
          title: s.display,
          icon: this.props.directive.provider.getIcon(s),
          color: s.color || 'rgba(255,255,255,0.1)',
          providerItem: result.entity
        } as ProviderComboBoxItem;
      })
      .map((result) => {
        if (this.props.directive.transform) {
          return this.props.directive.transform(result);
        }
        return result;
      })
      .sort((f) => (f.key === this.props.directive.initialValue ? -1 : 1))
      .value();

    const callout = this.props.directive.renderCallout?.({
      search: this.state.search,
      options: res
    }) as ProviderComboBoxItem;
    if (callout && !this.state.searchResult.loading) {
      res.push({
        ...callout,
        key: ProviderDirectiveComboWidget.CALLOUT_KEY
      });
    }
    return res;
  }

  isLoading() {
    if (!this.state.searchResult) {
      return true;
    }
    return this.state.searchResult.loading;
  }

  getSearchResult(val: string) {
    return this.props.directive.provider.doSearch({
      search: val,
      param: this.props.directive.param,
      matches: createSearchEventMatcher(val)
    });
  }

  componentDidMount(): void {
    this.setState({
      searchResult: this.getSearchResult(null)
    });
  }

  render() {
    return (
      <SmartPositionWidget position={this.props.directive.position}>
        <ComboSearchBoxWidget
          initialSelected={this.props.directive.initialValue}
          hint={this.state.searchResult ? this.state.searchResult.footerHint : null}
          loading={this.isLoading()}
          title={this.props.directive.provider.options.displayName}
          searchChanged={(search) => {
            // stop listening to the old search result
            if (this.state.searchResult) {
              this.state.searchResult.dispose();
            }

            this.setState({
              search: search,
              searchResult: this.getSearchResult(search)
            });
          }}
          items={this.getItems()}
          selected={async (selected, event) => {
            if (selected?.action) {
              this.props.resolve(null);
              await selected.action(event);
            } else {
              this.props.resolve(selected);
            }
          }}
        />
      </SmartPositionWidget>
    );
  }
}
