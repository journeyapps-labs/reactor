import * as React from 'react';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { UIDirectiveType, UIItemsDirective, UISearchEngineDirective } from '../../stores/combo/ComboBoxDirectives';
import { inject } from '../../inversify.config';
import { ItemsDirectiveComboWidget } from './directive-types/ItemsDirectiveComboWidget';
import { SearchEngineDirectiveComboWidget } from './directive-types/SearchEngineDirectiveComboWidget';
import { MultiDirectiveComboWidget } from './directive-types/MultiDirectiveComboWidget';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import { MousePosition } from './SmartPositionWidget';

export class ComboBoxLayer extends LayerDirective {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  show() {
    return !!this.comboBoxStore.directive;
  }

  getLayerContent(): React.JSX.Element {
    if (this.comboBoxStore.directive.type === UIDirectiveType.MULTI) {
      return (
        <MultiDirectiveComboWidget
          resolve={(items) => {
            this.comboBoxStore.resolve(items);
          }}
          directive={this.comboBoxStore.directive as UIItemsDirective}
        />
      );
    }
    if (this.comboBoxStore.directive.type === UIDirectiveType.ITEMS) {
      return (
        <ItemsDirectiveComboWidget
          resolve={(item, event: MousePosition) => {
            if (item.children?.length > 0) {
              const directive = this.comboBoxStore.directive as UIItemsDirective;
              this.comboBoxStore.directive = {
                ...directive,
                items: item.children,
                position: event || directive.position,
                title: item.title,
                title2: null
              } as UIItemsDirective;
              return;
            }
            this.comboBoxStore.resolve([item]);
          }}
          directive={this.comboBoxStore.directive as UIItemsDirective}
        />
      );
    }
    if (this.comboBoxStore.directive.type === UIDirectiveType.SEARCH_ENGINE) {
      return (
        <SearchEngineDirectiveComboWidget
          resolve={(item) => {
            this.comboBoxStore.resolve([item]);
          }}
          directive={this.comboBoxStore.directive as UISearchEngineDirective}
        />
      );
    }
  }

  layerWillHide() {
    if (this.comboBoxStore.directive.type === UIDirectiveType.MULTI) {
      return true;
    }
    return this.comboBoxStore.resolve(null);
  }
}
