import { FormInputOptions } from '../FormInput';
import { ControlInput, ControlInputGenerics } from './ControlInput';
import { EntityControl } from '../../controls/EntityControl';

export interface EntityInputOptions extends FormInputOptions {
  entityType: string;
  value: any;
  parent?: any;
}

export class EntityInput extends ControlInput<
  {
    OPTIONS: EntityInputOptions;
  } & ControlInputGenerics
> {
  constructor(options: EntityInputOptions) {
    super(
      options,
      new EntityControl({
        initialValue: options.value,
        entityType: options.entityType,
        parent: options.parent
      })
    );
  }
}
