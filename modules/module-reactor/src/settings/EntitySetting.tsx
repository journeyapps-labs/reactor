import * as React from 'react';
import { AbstractInteractiveControlOptions } from './AbstractInteractiveSetting';
import { makeObservable, observable } from 'mobx';
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
  @observable
  accessor entity: I;

  constructor(options: EntitySettingOptions<I>) {
    super(
      options,
      new EntityControl<I>({
        entityType: options.type,
        initialValue: options.defaultEntity
      })
    );
    this.entity = options.defaultEntity;
    this.control.registerListener({
      valueChanged: (value) => {
        this.entity = value;
        if (this.initialized) {
          options.changed?.(value);
          this.save();
        }
      }
    });
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
