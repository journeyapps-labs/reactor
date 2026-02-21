import { observable } from 'mobx';
import * as _ from 'lodash';
import { Action } from '../../actions/Action';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import {
  ComboBoxCheckedItem,
  ComboBoxItem,
  ComboBoxSearchEngine,
  ComboBoxSearchEngineResultEntry,
  UIDirective,
  UIDirectiveType,
  UIItemsDirective,
  UISearchEngineDirective
} from './ComboBoxDirectives';
import { PassiveActionValidationState } from '../../actions/validators/ActionValidator';
import { BaseObserver } from '@journeyapps-labs/common-utils';

export interface ComboBoxOptions {
  title?: string;
  title2?: string;
}

export interface ComboBoxItemSelectedEvent {
  items: ComboBoxItem[];
  preventDefault: () => any;
}

export interface ComboBoxStoreListener {
  itemsSelected?: (event: ComboBoxItemSelectedEvent) => any;
  itemsShown?: () => any;
}

/**
 * @deprecated
 */
export class ComboBoxStore extends BaseObserver<ComboBoxStoreListener> {
  @observable.shallow
  accessor directive: UIDirective;

  @observable
  accessor showConfigurator: boolean;

  constructor() {
    super();
    this.directive = null;
    this.showConfigurator = false;
  }

  resolve<T extends ComboBoxItem | ComboBoxSearchEngineResultEntry>(items: T[]): boolean {
    if (!this.directive) {
      return;
    }
    if (items && items.length > 0 && (items[0] as ComboBoxItem).link) {
      window.open((items[0] as ComboBoxItem).link, '_blank');
    }

    let prevented = false;
    this.iterateListeners((cb) =>
      cb.itemsSelected?.({
        items: items ?? [],
        preventDefault: () => {
          prevented = true;
        }
      })
    );

    if (prevented) {
      return false;
    }
    this.directive.resolve(items);
    this.directive = null;
    return true;
  }

  async showMultiSelectComboBox(
    items: ComboBoxCheckedItem[],
    position?: MousePosition | MouseEvent,
    options?: ComboBoxOptions & { buttons?: boolean }
  ): Promise<ComboBoxItem[]> {
    return this.setupDirective({
      items: items,
      position: position,
      type: UIDirectiveType.MULTI,
      ...options
    } as Partial<UIItemsDirective<ComboBoxCheckedItem>>);
  }

  async showComboBoxFromSearchEngine<T extends ComboBoxSearchEngineResultEntry>(
    engine: ComboBoxSearchEngine<T>,
    position?: MousePosition
  ): Promise<T> {
    const results = await this.setupDirective<T>({
      engine: engine,
      position: position,
      type: UIDirectiveType.SEARCH_ENGINE
    } as Partial<UISearchEngineDirective>);
    return results?.[0] || null;
  }

  async showComboBoxFromActions<T extends Action>(actions: T[], position?: MousePosition): Promise<T> {
    let item = await this.showComboBox(
      actions
        .filter((a) => a.validatePassively() !== PassiveActionValidationState.DISALLOWED)
        .map((action) => {
          return action.representAsComboBoxItem();
        }),
      position
    );

    if (!item) {
      return null;
    }

    return _.filter(actions, (action) => {
      return action.options.name === item.key;
    })[0];
  }

  async showComboBox(
    items: ComboBoxItem[],
    position?: MousePosition | MouseEvent,
    options?: ComboBoxOptions
  ): Promise<ComboBoxItem> {
    const result = await this.setupDirective({
      items: items,
      position: position,
      type: UIDirectiveType.ITEMS,
      title: options?.title,
      title2: options?.title2
    } as Partial<UIItemsDirective>);

    return !!result ? result[0] : null;
  }

  setupDirective<T extends ComboBoxItem>(directive: Partial<UIDirective>) {
    this.iterateListeners((cb) => cb.itemsShown?.());
    return new Promise<T[]>((resolve) => {
      this.directive = {
        ...directive,
        resolve: resolve
      } as UIDirective;
    }).finally(() => {
      this.directive = null;
    });
  }
}
