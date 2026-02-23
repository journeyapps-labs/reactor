import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ComboBoxDirective, ComboBoxDirectiveOptions } from '../../ComboBoxDirective';
import { ComboBoxItem } from '../../../combo/ComboBoxDirectives';
import { ComboBoxWidget } from '../../../../layers/combo/ComboBoxWidget';
import { useForceUpdate } from '../../../../hooks/useForceUpdate';
import { ControlledSearchWidget } from '../../../../widgets/search/ControlledSearchWidget';
import * as _ from 'lodash';
import { createSearchEventMatcherBool } from '@journeyapps-labs/lib-reactor-search';
import { styled } from '../../../themes/reactor-theme-fragment';
import { ioc } from '../../../../inversify.config';
import { ComboBoxStore2 } from '../../ComboBoxStore2';
import { SimpleComboBoxDirective } from './SimpleComboBoxDirective';

export interface BaseComboBoxDirectiveOptions<T extends ComboBoxItem = ComboBoxItem> extends ComboBoxDirectiveOptions {
  items: T[];
  hideSearch?: boolean;
  sort?: boolean;
}

export class BaseComboBoxDirective<
  T extends ComboBoxItem = ComboBoxItem,
  O extends BaseComboBoxDirectiveOptions<T> = BaseComboBoxDirectiveOptions<T>
> extends ComboBoxDirective<T, O> {
  private matcher: (c: string) => boolean;

  constructor(options: O) {
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

  setSelected(items: T[]) {
    super.setSelected(items);
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

export interface BaseComboBoxDirectiveWidgetProps {
  directive: BaseComboBoxDirective;
}

export const SimpleComboBoxDirectiveWidget: React.FC<BaseComboBoxDirectiveWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  const store = ioc.get(ComboBoxStore2);
  const childDirective = useRef<{
    directive: SimpleComboBoxDirective;
    key: string;
  }>(null);

  useEffect(() => {
    return props.directive.registerListener({
      dismissed: () => {
        childDirective.current?.directive.dismiss();
      }
    });
  }, [props.directive]);

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
        hovered={(item, dimensions) => {
          if (!dimensions || item.key === childDirective.current?.key) {
            return;
          }
          childDirective.current?.directive.dismiss();
          childDirective.current = null;
          if (item.children?.length > 0) {
            childDirective.current = {
              key: item.key,
              directive: new SimpleComboBoxDirective({
                items: item.children,
                event: {
                  clientX: dimensions.x + dimensions.width,
                  clientY: dimensions.y
                }
              })
            };
            store.show(childDirective.current.directive);
          }
        }}
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
