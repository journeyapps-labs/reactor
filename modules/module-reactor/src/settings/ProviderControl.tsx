import * as React from 'react';
import { AbstractInteractiveSetting, AbstractInteractiveControlOptions } from './AbstractInteractiveSetting';
import { Provider } from '../providers/Provider';
import { autorun, makeObservable, observable } from 'mobx';
import { Observer } from 'mobx-react';
import { ProviderButtonWidget } from '../widgets/forms/ProviderButtonWidget';

export interface ProviderControlOptions<I> extends AbstractInteractiveControlOptions {
  provider: Provider<I>;
  defaultEntity: I;
  changed?: (item: I) => any;
}

/**
 * @deprecated use EntitySetting instead
 */
export class ProviderControl<I> extends AbstractInteractiveSetting<ProviderControlOptions<I>> {
  @observable
  accessor entity: I;

  constructor(options: ProviderControlOptions<I>) {
    super(options);
    this.entity = options.defaultEntity;
  }

  setItem(item: I) {
    this.entity = item;
    this.save();
  }

  async init() {
    await super.init();
    autorun(async () => {
      if (this.options.changed) {
        this.options.changed(this.entity);
      }
    });
  }

  getComboBoxItems() {
    return [];
  }

  async deserialize(data: ReturnType<this['serialize']>) {
    try {
      const entity = await this.options.provider.deserialize(data.entity);
      if (!!entity) {
        this.entity = entity;
      }
    } catch (ex) {
      console.log(`failed to deserialize preference ${this.options.name}`);
    }
  }

  generateControl(): React.JSX.Element {
    return (
      <Observer
        children={() => {
          if (!this.initialized) {
            return null;
          }

          return (
            <ProviderButtonWidget
              allowClearing={false}
              value={this.entity}
              entityType={this.options.provider.options.type}
              onChange={(item) => {
                if (item) {
                  this.setItem(item);
                }
              }}
            />
          );
        }}
      />
    );
  }

  reset() {
    this.entity = this.options.defaultEntity;
  }

  serialize() {
    return {
      entity: this.options.provider.serialize(this.entity)
    };
  }

  toggle() {}
}
