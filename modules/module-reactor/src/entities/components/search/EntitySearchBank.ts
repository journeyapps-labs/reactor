import { ComponentBank } from '../banks/ComponentBank';
import { EntityComboBoxItem, EntitySearchEngineComponent } from './EntitySearchEngineComponent';
import { ComboBoxDirective } from '../../../stores/combo2/ComboBoxDirective';
import { MousePosition } from '../../../layers/combo/SmartPositionWidget';
import { ComposableComboBoxDirective } from '../../../stores/combo2/directives/ComposableComboBoxDirective';
import { ComboBoxStore2 } from '../../../stores/combo2/ComboBoxStore2';

export interface EntitySearchBankOptions {
  label: string;
}

export interface EntitySearchResolveOptions<T = any> {
  event?: MousePosition;
  filter?: (entity: T) => boolean;
  parent?: any;
  autoSelectedIsolatedEntity?: boolean;
}

export class EntitySearchBank<T = any> extends ComponentBank<EntitySearchEngineComponent<T>> {
  constructor(protected options: EntitySearchBankOptions) {
    super();
  }

  async resolveOneEntity(options: EntitySearchResolveOptions<T>, comboBoxStore: ComboBoxStore2): Promise<T | null> {
    const engineComponents = this.getItems();
    if (engineComponents.length === 1 && options.autoSelectedIsolatedEntity) {
      const engine = engineComponents[0].getSearchEngine();
      const res = await engine.autoSelectIsolatedItem({
        value: null
      });
      if (res) {
        return res;
      }
    }

    const directive = await comboBoxStore.show(this.getComboBoxDirective(options));
    return directive.getSelected()[0]?.entity || null;
  }

  getComboBoxDirective(options: EntitySearchResolveOptions<T>): ComboBoxDirective<EntityComboBoxItem<T>> {
    const setupDirective = (component: EntitySearchEngineComponent<T>) => {
      const directive = component.getComboBoxDirective({
        position: options.event,
        filter: options.filter
      });

      if (options.parent) {
        directive.setParent(options.parent);
      }
      return directive;
    };
    if (this.getItems().length > 1) {
      return new ComposableComboBoxDirective<EntityComboBoxItem<T>>({
        title: `Select ${this.options.label}`,
        event: options.event,
        directives: this.getItems().map((e) => {
          return setupDirective(e);
        })
      });
    }
    const d = this.getItems()[0];
    return setupDirective(d);
  }
}
