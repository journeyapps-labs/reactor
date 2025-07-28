import * as React from 'react';
import { ComboBoxDirective, ComboBoxDirectiveOptions } from '../ComboBoxDirective';
import { ComboBoxItem } from '../../combo/ComboBoxDirectives';
import { ComboBoxWidget } from '../../../layers/combo/ComboBoxWidget';
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import { ControlledSearchWidget } from '../../../widgets/search/ControlledSearchWidget';
import * as _ from 'lodash';
import { createSearchEventMatcherBool } from '@journeyapps-labs/lib-reactor-search';
import { styled } from '../../themes/reactor-theme-fragment';

export interface SimpleComboBoxDirectiveOptions<T extends ComboBoxItem = ComboBoxItem>
  extends ComboBoxDirectiveOptions {
  items: T[];
  selected?: string;
  hideSearch?: boolean;
  sort?: boolean;
}

export class SimpleComboBoxDirective<T extends ComboBoxItem = ComboBoxItem> extends ComboBoxDirective<
  T,
  SimpleComboBoxDirectiveOptions<T>
> {
  private matcher: (c: string) => boolean;

  constructor(options: SimpleComboBoxDirectiveOptions<T>) {
    super(options);
  }

  showSearch() {
    if (this.options.hideSearch) {
      return false;
    }
    return this.getAllItems().length > 5;
  }

  selectItem(key: string) {
    const found = this.options.items.find((i) => i.key === key);
    this.setSelected([found]);
  }

  getSelectedItem(): T | null {
    return this.getSelected()[0] || null;
  }

  setSelected(items: T[]) {
    super.setSelected(items);
    this.dismiss();
    this.getSelected().forEach((s) => {
      s.action?.(this.getPosition());
    });
  }

  getContent(): React.JSX.Element {
    return <SimpleComboBoxDirectiveWidget directive={this} />;
  }

  getAllItems() {
    if (this.options.sort) {
      return _.sortBy(this.options.items, (i) => i.title);
    }
    return this.options.items;
  }

  getItems() {
    if (!this.matcher) {
      return this.getAllItems();
    }
    return this.getAllItems().filter((i) => this.matcher(i.title));
  }

  setSearch(search: string) {
    super.setSearch(search);
    if (this.search === null) {
      this.matcher = null;
    } else {
      this.matcher = createSearchEventMatcherBool(search);
    }
  }
}

export interface SimpleComboBoxDirectiveWidgetProps {
  directive: SimpleComboBoxDirective;
}

export const SimpleComboBoxDirectiveWidget: React.FC<SimpleComboBoxDirectiveWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();

  if (props.directive.getAllItems().length === 0) {
    return <S.NoItems>No items</S.NoItems>;
  }

  return (
    <>
      {props.directive.showSearch() ? (
        <S.Search
          focusOnMount={true}
          searchChanged={(search) => {
            props.directive.setSearch(search);
            forceUpdate();
          }}
        />
      ) : null}
      <ComboBoxWidget
        maxHeight={!props.directive.showSearch() ? 600 : null}
        initialSelected={null}
        placeholder={props.directive.searchPlaceholder}
        items={props.directive.getItems()}
        selected={(item, event) => {
          if (item.link) {
            window.open(item.link, '_blank');
          }
          props.directive.selectItem(item.key);
        }}
      />
    </>
  );
};

namespace S {
  export const Search = styled(ControlledSearchWidget)`
    margin-bottom: 5px;
    min-width: 200px;
  `;

  export const NoItems = styled.div`
    font-style: italic;
    font-size: 12px;
    color: ${(p) => p.theme.text.secondary};
    text-align: center;
  `;
}
