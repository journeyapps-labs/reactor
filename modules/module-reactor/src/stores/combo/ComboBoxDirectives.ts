import { ReactorIcon } from '../../widgets/icons/IconWidget';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import { Provider } from '../../providers/Provider';
import { SearchResultEntry, SearchEngineInterface } from '@journeyapps-labs/lib-reactor-search';

export interface ComboBoxItem {
  title: string;
  key: string;
  children?: ComboBoxItem[];
  icon?: ReactorIcon;
  link?: string;
  download?: {
    name: string;
    url: string;
  };
  color?: string;
  group?: string;
  action?: (event: MousePosition) => Promise<any>;
  right?: React.JSX.Element;
  disabled?: boolean;
  badge?: {
    label: string;
    foreground: string;
    background: string;
    action?: (event: MousePosition) => any;
  };
}

export interface ProviderComboBoxItem<T = any> extends ComboBoxItem {
  providerItem: T;
}

export interface ComboBoxCheckedItem extends ComboBoxItem {
  checked?: boolean;
}

export enum UIDirectiveType {
  ITEMS = 'items',
  PROVIDER = 'provider',
  SEARCH_ENGINE = 'search',
  MULTI = 'multi'
}

export interface RenderCalloutEvent<T extends ComboBoxItem = ComboBoxItem> {
  search: string;
  options: T[];
}

export type RenderCalloutFunction<T extends ComboBoxItem = ComboBoxItem> = (event: RenderCalloutEvent<T>) => T;

export interface UIDirective {
  position: MousePosition;
  resolve: (item: ComboBoxItem[]) => any;
  type: UIDirectiveType;
  renderCallout?: RenderCalloutFunction;
  initialValue?: string;
  title?: string;
  title2?: string;
}

export interface UIItemsDirective<T extends ComboBoxItem = ComboBoxItem> extends UIDirective {
  items: T[];
  buttons?: boolean;
}

export interface UIProviderDirective<T extends any = any> extends UIDirective {
  provider: Provider;
  param?: any;
  filter?: (item: T) => boolean;
  transform?: (item: ProviderComboBoxItem<T>) => ProviderComboBoxItem<T>;
}

export interface UISearchEngineDirective extends UIDirective {
  engine: ComboBoxSearchEngine;
}

export interface ComboBoxSearchEngineResultEntry extends SearchResultEntry, ComboBoxItem {}

export interface ComboBoxSearchEngine<T extends ComboBoxSearchEngineResultEntry = ComboBoxSearchEngineResultEntry>
  extends SearchEngineInterface<T> {}
