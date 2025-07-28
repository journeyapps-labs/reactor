import * as React from 'react';
import { FormInput, FormInputGenerics, FormInputOptions, FormInputRenderOptions } from '../FormInput';
import { ProviderButtonWidget } from '../../widgets';

export interface ProviderInputOptions extends FormInputOptions {
  entityType: string;
  value: any;
}

/**
 * @deprecated
 */
export class ProviderInput extends FormInput<
  {
    VALUE: any;
    OPTIONS: ProviderInputOptions;
  } & FormInputGenerics
> {
  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return (
      <ProviderButtonWidget
        value={this.value}
        entityType={this.options.entityType}
        onChange={(item) => {
          this.setValue(item);
        }}
      />
    );
  }
}
