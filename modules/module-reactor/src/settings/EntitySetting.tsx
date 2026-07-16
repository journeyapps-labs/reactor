import { AbstractInteractiveControlOptions } from './AbstractInteractiveSetting';
import { computed, observable } from 'mobx';
import { ioc } from '../inversify.config';
import { AbstractUserSetting } from './AbstractUserSetting';
import { EntityControl } from '../controls/EntityControl';
import { System } from '../core/System';

export interface EntitySettingOptions<I> extends AbstractInteractiveControlOptions {
  type: string;
  defaultEntity: I;
  changed?: (item: I) => any;
}

export class EntitySetting<I> extends AbstractUserSetting<EntityControl<I>, EntitySettingOptions<I>> {
  constructor(options: EntitySettingOptions<I>) {
    super(
      options,
      new EntityControl<I>({
        entityType: options.type,
        initialValue: options.defaultEntity
      })
    );
    this.control.registerListener({
      valueChanged: (value) => {
        if (this.initialized) {
          options.changed?.(value);
          this.save();
        }
      }
    });
  }

  @computed get entity() {
    return this.control.value;
  }

  updateOptions(options: Partial<EntitySettingOptions<I>>) {
    super.updateOptions(options);
    if (!this.initialized && options.defaultEntity !== undefined) {
      this.setItem(options.defaultEntity);
    }
  }

  setItem(item: I) {
    this.control.value = item;
  }

  async deserialize(data: ReturnType<this['serialize']>) {
    try {
      const entity = await ioc.get(System).decodeEntity<I>(data.entity);
      if (!!entity) {
        this.control.value = entity;
      }
    } catch (ex) {
      console.log(`failed to deserialize preference ${this.options.name}`);
    }
  }

  reset() {
    this.control.value = this.options.defaultEntity;
  }

  serialize() {
    return {
      entity: ioc.get(System).getDefinition(this.options.type).encode(this.entity)
    };
  }
}
